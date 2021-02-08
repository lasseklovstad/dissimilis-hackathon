import React, { useEffect, useReducer, useState } from "react"
import { Grid, makeStyles } from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavBarCreateSong } from "../../components/NavBarCreateSong/NavBarCreateSong.component"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { Song } from "../../components/Song/Song.component"
import { useBarsPerRow } from "../../utils/useBarsPerRow"
import { useVoice } from "../../utils/useVoice"
import { ISong } from "../../models/ISong"
import {
    useGetSong,
    useUpdateNote,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { SongContext, songReducer } from "./SongContextProvider.component"
import { IVoice } from "../../models/IVoice"
import { chords, getNotesFromChord, notes } from "../../models/chords"
import { IBar, IChordAndNotes } from "../../models/IBar"

const useStyles = makeStyles({
    root: {
        marginLeft: "16px",
        marginTop: "32px",
        marginRight: "16px",
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
    },
})

const heightOfBar = 160

export const SongView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = useParams<{ songId: string }>()
    const { getSong, songInit } = useGetSong(songId)
    const barsPerRow = useBarsPerRow()
    const [selectedChord, setSelectedChord] = useState("C")
    const [selectedNoteLength, setSelectedNoteLength] = useState(1)
    const [isNoteSelected, setNoteIsSelected] = useState(true)
    const { putSong } = useUpdateSong(songId)

    // added values
    const [selectedNoteId, setSelectedNoteId] = useState<number | undefined | null>(
        undefined
    )
    const [selectedBar, setSelectedBar] = useState<IBar | undefined>(undefined)
    const [selectedNotePosition, setSelectedNotePosition] = useState<number>(0)

    const setValuesForSelectedNote = (
        noteId: number | undefined | null,
        bar: IBar | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => {
        setNoteIsSelected(isNote)
        setSelectedNoteLength(noteLength)
        setSelectedChord(chord)

        setSelectedNoteId(noteId)
        setSelectedBar(bar)
        setSelectedNotePosition(position)
    }

    const [song, dispatchSong] = useReducer(songReducer, {
        title: "",
        songId: 0,
        denominator: 4,
        numerator: 4,
        voices: [],
    } as ISong)

    const { denominator, numerator, voices } = song
    const selectedVoiceId = useVoice(voices)
    const selectedVoice = voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )

    const { updateNote } = useUpdateNote(
        songId,
        selectedVoiceId,
        selectedBar?.barId,
        selectedNoteId
    )

    // Should only run if there is something selected
    const handleChangeChord = async (chord: string) => {
        // need to check the if statement
        if (selectedNoteId && selectedVoiceId && selectedBar) {
            const notes = isNoteSelected ? [chord] : getNotesFromChord(chord)

            const { error, result } = await updateNote.run({
                position: selectedNotePosition,
                length: selectedNoteLength,
                notes,
            })

            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
        setSelectedChord(chord)
    }

    // need to find out where the setselectednotelength should be placed
    const handleChangeNoteLength = (noteLength: number) => {
        if (selectedNoteId && selectedVoiceId && selectedBar) {
            const note = selectedBar.chordsAndNotes.find(
                (b) => b.noteId === selectedNoteId
            )

            if (note) {
                if (note.length > noteLength) {
                    updateNoteLength(noteLength, note.position)
                    return
                }

                const isPossible = checkIfUpdateLengthIsPossible(
                    note,
                    noteLength,
                    selectedBar.chordsAndNotes.findIndex(
                        (b) => b.noteId === selectedNoteId
                    )
                )

                if(isPossible) {
                    return
                }

                setValuesForSelectedNote(undefined, undefined, "C", noteLength, false, 0)
                return
            }

        }
        setSelectedNoteLength(noteLength)
    }

    const checkIfUpdateLengthIsPossible = (
        note: IChordAndNotes,
        noteLength: number,
        index: number
    ) => {
        const nextNote = selectedBar?.chordsAndNotes[index + 1]
        const previousNote = selectedBar?.chordsAndNotes[index - 1]

        if (note.position === 0 && nextNote) {
            let spaceAvailable = note.length + nextNote.length
            if (nextNote.notes[0] === "Z" && spaceAvailable >= noteLength) {
                updateNoteLength(noteLength, note.position)
                return true
            }
        }

        if ((note.position === 3 || !nextNote) && previousNote) {
            let spaceAvailable = note.length + previousNote.length
            if (previousNote.notes[0] === "Z" && spaceAvailable >= noteLength) {
                updateNoteLength(
                    noteLength,
                    note.position - noteLength + note.length
                )
                return true
            }
        }

        if (nextNote && previousNote) {
            let spaceAvailableToRigth = nextNote.length + note.length
            let spaceAvailableToLeft = previousNote.length + note.length

            if (
                nextNote.notes[0] === "Z" &&
                spaceAvailableToRigth >= noteLength
            ) {
                updateNoteLength(noteLength, note.position)
                return true
            }

            if (
                previousNote.notes[0] === "Z" &&
                spaceAvailableToLeft >= noteLength
            ) {
                updateNoteLength(noteLength, previousNote.position)
                return true
            }

            if (
                nextNote.notes[0] === "Z" &&
                previousNote.notes[0] === "Z" &&
                spaceAvailableToLeft + nextNote.length >= noteLength
            ) {
                updateNoteLength(noteLength, previousNote.position)
                return true
            }
        }
        return false
    }

    const updateNoteLength = async (noteLength: number, position: number) => {
        const notes = isNoteSelected
            ? [selectedChord]
            : getNotesFromChord(selectedChord)

        const { error, result } = await updateNote.run({
            position,
            length: noteLength,
            notes,
        })

        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })

            // MÅ oppdatere verdiene til valgte bar og posisjon ut ifra det som har blitt oppdatert
            setSelectedNotePosition(position)
            setSelectedBar(result.data)
        }
    }

    useEffect(() => {
        if (songInit) {
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit])

    const handleTitleBlur = async (title: string) => {
        if (title !== song.title) {
            const { error, result } = await putSong.run({ title })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

    const handleAddVoice = (voice: IVoice) => {
        dispatchSong({ type: "ADD_VOICE", voice })
        history.push(`?voice=${voice.songVoiceId}`)
    }

    const handleDeleteVoice = (voice: IVoice) => {
        dispatchSong({ type: "DELETE_VOICE", songVoiceId: voice.songVoiceId })
    }

    const handleUpdateVoice = (voice: IVoice) => {
        dispatchSong({ type: "UPDATE_VOICE", voice })
    }

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <>
            <ErrorDialog
                isError={getSong.isError}
                error={getSong.error}
                title={t("Modal:getSongError")}
            />

            {selectedVoiceId !== undefined && selectedVoice && (
                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <NavBarCreateSong
                            title={song.title}
                            onTitleBlur={handleTitleBlur}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CreateSongTab
                            onDeleteVoice={handleDeleteVoice}
                            onUpdateVoice={handleUpdateVoice}
                            onAddVoice={handleAddVoice}
                            songId={songId}
                            voices={song.voices}
                            selectedVoice={selectedVoiceId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SongContext.Provider
                            value={{
                                dispatchSong,
                                selectedChord,
                                selectedNoteLength,
                                isNoteSelected,
                            }}
                        >
                            <Song
                                barsPerRow={barsPerRow}
                                voice={selectedVoice}
                                timeSignature={{ denominator, numerator }}
                                heightOfBar={heightOfBar}
                                exportMode={false}
                                setValuesForSelectedNote={
                                    setValuesForSelectedNote
                                }
                                selectedNoteId={selectedNoteId}
                            />
                        </SongContext.Provider>
                    </Grid>
                </Grid>
            )}

            {selectedVoiceId && (
                <BottomBar
                    noteIsSelected={isNoteSelected}
                    onNoteSelectedChange={(selected) =>
                        setNoteIsSelected(selected)
                    }
                    selectedChord={selectedChord}
                    onChordChange={(chord) => handleChangeChord(chord)}
                    selectedNoteLength={selectedNoteLength}
                    onNoteLengthChange={(length) =>
                        handleChangeNoteLength(length)
                    }
                    timeSignature={{ denominator, numerator }}
                    addBar={(bar) => dispatchSong({ type: "ADD_BAR", bar })}
                    songId={songId}
                    voiceId={selectedVoiceId}
                    notesOrChords={isNoteSelected ? notes : chords}
                />
            )}
        </>
    )
}
