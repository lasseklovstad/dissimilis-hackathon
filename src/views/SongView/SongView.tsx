import React, { useEffect, useReducer, useState } from "react"
import { Grid, makeStyles, Slide, useScrollTrigger } from "@material-ui/core"
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
import { IBar, IChord } from "../../models/IBar"
import { colors } from "../../utils/colors"

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
        paddingTop: "24px",
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
    const [selectedChordLength, setSelectedChordLength] = useState(1)
    const [isNoteSelected, setNoteIsSelected] = useState(true)
    const { putSong } = useUpdateSong(songId)
    const trigger = useScrollTrigger()
    const [selectedChordId, setSelectedChordId] = useState<
        number | undefined | null
    >(undefined)
    const [selectedBarId, setSelectedBarId] = useState<number | undefined>(
        undefined
    )
    const [selectedChordPosition, setSelectedChordPosition] = useState<number>(
        0
    )
    const setValuesForSelectedChord = (
        noteId: number | undefined | null,
        barId: number | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => {
        setSelectedChord(chord)
        setSelectedChordLength(noteLength)
        setSelectedChordId(noteId)
        setSelectedBarId(barId)
        setSelectedChordPosition(position)
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
    const [selectedVoice, setSelectedVoice] = useState<IVoice | undefined>(
        voices.find((voice) => voice.songVoiceId === selectedVoiceId)
    )

    useEffect(() => {
        setSelectedVoice(
            song.voices.find((voice) => voice.songVoiceId === selectedVoiceId)
        )
    }, [song, selectedVoiceId])

    const { updateNote } = useUpdateNote(
        songId,
        selectedVoiceId,
        selectedBarId,
        selectedChordId
    )

    const clickOutsideOfBottomBarListener = (e: any) => {
        if (e.target.id !== "chordButton" && e.target.id !== "singleChord") {
            setValuesForSelectedChord(
                undefined,
                undefined,
                selectedChord,
                selectedChordLength,
                isNoteSelected,
                0
            )
        }
    }

    const handleChangeChord = (chord: string) => {
        if (selectedChordId && selectedVoiceId && selectedBarId) {
            makeChordUpdate(
                chord,
                selectedChordLength,
                selectedChordPosition,
                isNoteSelected
            )
        } else {
            setSelectedChord(chord)
        }
    }

    const makeChordUpdate = async (
        chord: string,
        length: number,
        position: number,
        isNoteSelected: boolean
    ) => {
        const notes = isNoteSelected ? [chord] : getNotesFromChord(chord)
        const { error, result } = await updateNote.run({
            position,
            length,
            notes,
        })

        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            setValuesForSelectedChord(
                selectedChordId,
                result.data.barId,
                chord,
                length,
                isNoteSelected,
                position
            )
        }
    }

    const handleChangeNoteLength = (updatedNoteLength: number) => {
        if (selectedChordId && selectedVoiceId && selectedBarId) {
            const selectedBar = selectedVoice?.bars.find(
                (b) => b.barId === selectedBarId
            )
            const note = selectedBar?.chords.find(
                (b) => b.chordId === selectedChordId
            )
            if (selectedBar && note && note.length > updatedNoteLength) {
                makeChordUpdate(
                    selectedChord,
                    updatedNoteLength,
                    note.position,
                    isNoteSelected
                )
            } else if (selectedBar) {
                updateNoteLengthIfPossible(
                    reduceChordsAndNotes(updatedNoteLength, selectedBar),
                    updatedNoteLength
                )
            }
        } else {
            setSelectedChordLength(updatedNoteLength)
        }
    }

    const reduceChordsAndNotes = (
        updatedNoteLength: number,
        selectedBar: IBar
    ) => {
        return selectedBar.chords.reduce((noter: IChord[], note) => {
            if (note.notes[0] === "Z") {
                const numberOfRests = note.length
                const rests = []
                for (let i = 0; i < numberOfRests; i++) {
                    rests.push({
                        length: 1,
                        notes: ["Z"],
                        position: note.position + i,
                        chordId: null,
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
        }, [])
    }

    const updateNoteLengthIfPossible = (
        allChords: IChord[],
        updatedNoteLength: number
    ) => {
        let indexOfChord = allChords.findIndex(
            (c) => c.chordId === selectedChordId
        )
        let i = 0
        while (i <= updatedNoteLength) {
            const start = indexOfChord - i
            const end = start + updatedNoteLength
            const interval = allChords.slice(start, end)
            const isOnlyRests =
                interval.findIndex(
                    (currentChord) =>
                        currentChord.chordId !== selectedChordId &&
                        currentChord.notes[0] !== "Z"
                ) === -1
            if (isOnlyRests && interval.length === updatedNoteLength) {
                makeChordUpdate(
                    selectedChord,
                    updatedNoteLength,
                    start,
                    isNoteSelected
                )
                break
            }
            i++
        }
    }

    const handleNoteSelectedChange = (updatedNoteIsSelected: boolean) => {
        let chord
        if (isNoteSelected) {
            chord = selectedChord
        } else {
            chord = selectedChord.includes("#")
                ? selectedChord.substring(0, 2)
                : selectedChord.charAt(0)
        }
        if (selectedChordId && selectedVoiceId) {
            makeChordUpdate(
                chord,
                selectedChordLength,
                selectedChordPosition,
                updatedNoteIsSelected
            )
        } else {
            setNoteIsSelected(updatedNoteIsSelected)
            setSelectedChord(chord)
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

        if (voice.songVoiceId === selectedVoiceId) {
            history.push(`/song/${songId}`)
        }
    }

    const handleUpdateVoice = (voice: IVoice) => {
        dispatchSong({ type: "UPDATE_VOICE_NAME", voice })
    }

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <SongContext.Provider
            value={{
                dispatchSong,
                selectedChord,
                selectedChordLength,
                isNoteSelected,
            }}
        >
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
                                    voiceId={selectedVoiceId}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CreateSongTab
                                    onDeleteVoice={handleDeleteVoice}
                                    onUpdateVoice={handleUpdateVoice}
                                    onAddVoice={handleAddVoice}
                                    songId={songId}
                                    voices={song.voices}
                                    selectedVoiceId={selectedVoiceId}
                                />
                            </Grid>
                        </Grid>
                    </Slide>
                    <Grid item xs={12} className={classes.body}>
                        <Song
                            barsPerRow={barsPerRow}
                            voice={selectedVoice}
                            timeSignature={{ denominator, numerator }}
                            heightOfBar={heightOfBar}
                            exportMode={false}
                            setValuesForSelectedChord={
                                setValuesForSelectedChord
                            }
                            selectedNoteId={selectedChordId}
                        />
                    </Grid>
                </Grid>
            )}
            {selectedVoiceId && (
                <BottomBar
                    noteIsSelected={isNoteSelected}
                    onNoteSelectedChange={(selected) =>
                        handleNoteSelectedChange(selected)
                    }
                    onChordChange={(chord) => handleChangeChord(chord)}
                    onChordLengthChange={(length) =>
                        handleChangeNoteLength(length)
                    }
                    timeSignature={{ denominator, numerator }}
                    addBar={(bar) => dispatchSong({ type: "ADD_BAR", bar })}
                    songId={songId}
                    voiceId={selectedVoiceId}
                    chordDropdownContent={isNoteSelected ? notes : chords}
                    clickOutsideListener={clickOutsideOfBottomBarListener}
                />
            )}
        </SongContext.Provider>
    )
}
