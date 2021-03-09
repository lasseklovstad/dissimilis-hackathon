import React, { useEffect, useReducer, useRef, useState } from "react"
import {
    Grid,
    makeStyles,
    RootRef,
    Slide,
    useScrollTrigger,
} from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavBarCreateSong } from "../../components/NavBarCreateSong/NavBarCreateSong.component"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { useBarsPerRow } from "../../utils/useBarsPerRow"
import { Song } from "../../components/Song/Song.component"
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
import { IChordAndNotes } from "../../models/IBar"
import { colors } from "../../utils/colors"
import useOutsideClick from "./clickOutside"


const useStyles = makeStyles({
    root: {
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
    },
    header: {
        backgroundColor: colors.gray_100,
        position: "sticky", // For Safari: -webkit-sticky
        zIndex: 100,
        top: "0",
        paddingTop: "32px",
        paddingLeft: "3.5vw",
        paddingRight: "3.5vw",
    },
    body: {
        marginLeft: "3.5vw",
        marginRight: "3.5vw",
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
    const trigger = useScrollTrigger()

    const refHighlightedNote = useRef<HTMLAnchorElement>(null)
    const refBottomBar = useRef<HTMLAnchorElement>(null)

    const [selectedNoteId, setSelectedNoteId] = useState<
        number | undefined | null
    >(undefined)

    const [selectedBarId, setSelectedBarId] = useState<number | undefined>(
        undefined
    )
    const [selectedNotePosition, setSelectedNotePosition] = useState<number>(0)

    const setValuesForSelectedNote = (
        noteId: number | undefined | null,
        barId: number | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => {
        setSelectedChord(chord)
        setSelectedNoteLength(noteLength)
        setSelectedNoteId(noteId)
        setSelectedBarId(barId)
        setSelectedNotePosition(position)
        setNoteIsSelected(isNote)
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
        selectedBarId,
        selectedNoteId
    )

    const setFocusOnHighlightedButton = () => {
        if (
            selectedNoteId &&
            refHighlightedNote &&
            refHighlightedNote.current
        ) {
            refHighlightedNote.current.focus()
        }
    }

    const handleChangeChord = (chord: string) => {
        if (selectedNoteId && selectedVoiceId && selectedBarId) {
            makeNoteUpdate(
                chord,
                selectedNoteLength,
                selectedNotePosition,
                isNoteSelected
            )
            setFocusOnHighlightedButton()
            return
        }
        setSelectedChord(chord)
        setFocusOnHighlightedButton()
    }

    const makeNoteUpdate = async (
        chord: string,
        length: number,
        position: number,
        isNote: boolean
    ) => {
        const notes = isNote ? [chord] : getNotesFromChord(chord)
        const { error, result } = await updateNote.run({
            position,
            length,
            notes,
        })

        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            setValuesForSelectedNote(
                selectedNoteId,
                result.data.barId,
                chord,
                length,
                isNote,
                position
            )
        }
    }

    const handleChangeNoteLength = (noteLength: number) => {
        if (selectedNoteId && selectedVoiceId && selectedBarId) {
            const selectedBar = selectedVoice?.bars.find(
                (b) => b.barId === selectedBarId
            )
            const note = selectedBar?.chordsAndNotes.find(
                (b) => b.noteId === selectedNoteId
            )
            if (selectedBar && note) {
                if (note.length > noteLength) {
                    makeNoteUpdate(
                        selectedChord,
                        noteLength,
                        note.position,
                        isNoteSelected
                    )
                    return
                }
            }
            reduceChordsAndNotes(noteLength)
            return
        }
        setSelectedNoteLength(noteLength)
    }

    const reduceChordsAndNotes = (noteLength: number) => {
        const selectedBar = selectedVoice?.bars.find(
            (b) => b.barId === selectedBarId
        )
        if (selectedBar) {
            const reducedChords = selectedBar.chordsAndNotes.reduce(
                (noter: IChordAndNotes[], note) => {
                    if (note.notes[0] === "Z") {
                        const numberOfRests = note.length
                        const rests = []
                        for (let i = 0; i < numberOfRests; i++) {
                            rests.push({
                                length: 1,
                                notes: ["Z"],
                                position: note.position + i,
                                noteId: null,
                            })
                        }
                        return [...noter, ...rests]
                    }
                    const numberOfChords = note.length
                    const notes = []
                    for (let i = 0; i < numberOfChords; i++) {
                        notes.push(note)
                    }
                    return [...noter, ...notes]
                },
                []
            )
            checkIfUpdateNoteLengthIsPossible(reducedChords, noteLength)
        }
    }

    const checkIfUpdateNoteLengthIsPossible = (
        allChords: IChordAndNotes[],
        noteLength: number
    ) => {
        let indexOfChord = allChords.findIndex(
            (c) => c.noteId === selectedNoteId
        )
        let i = 0
        while (i <= noteLength) {
            const start = indexOfChord - i
            const end = start + noteLength
            const interval = allChords.slice(start, end)
            const isOnlyRests =
                interval.findIndex(
                    (currentChord) =>
                        currentChord.noteId !== selectedNoteId &&
                        currentChord.notes[0] !== "Z"
                ) === -1
            if (isOnlyRests && interval.length === noteLength) {
                makeNoteUpdate(selectedChord, noteLength, start, isNoteSelected)
                break
            }
            i++
        }
    }

    const handleNoteSelectedChange = (selected: boolean) => {
        let chord
        if (isNoteSelected) {
            chord = selectedChord
        } else if (selectedChord.includes("#")) {
            chord = selectedChord.substring(0, 2)
        } else {
            chord = selectedChord.charAt(0)
        }
        if (selectedNoteId && selectedVoiceId) {
            makeNoteUpdate(
                chord,
                selectedNoteLength,
                selectedNotePosition,
                selected
            )
            setFocusOnHighlightedButton()
            return
        }
        setNoteIsSelected(selected)
        setSelectedChord(chord)
        setFocusOnHighlightedButton()
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
                    <Slide appear={false} direction="down" in={!trigger}>
                        <Grid container className={classes.header}>
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
                        </Grid>
                    </Slide>
                    <Grid item xs={12} className={classes.body}>
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
                                refHighlightedNote={refHighlightedNote}
                            />
                        </SongContext.Provider>
                    </Grid>
                </Grid>
            )}
            {selectedVoiceId && (
                
                <BottomBar
                    
                    noteIsSelected={isNoteSelected}
                    onNoteSelectedChange={(selected) =>
                        handleNoteSelectedChange(selected)
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
                    onExitedNoteLengthSelect={setFocusOnHighlightedButton}
                    refBottomBar={refBottomBar}
                />
            )}
        </>
    )
}
