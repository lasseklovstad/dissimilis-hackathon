import React, {
    MutableRefObject,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react"
import { Grid, makeStyles, Slide, useScrollTrigger } from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { useBarsPerRow } from "../../utils/useBarsPerRow"
import { Song } from "../../components/Song/Song.component"
import { useVoice } from "../../utils/useVoice"
import { ISong } from "../../models/ISong"
import {
    useCopyBars,
    useDeleteBars,
    useDeleteChord,
    useGetSong,
    useUpdateChord,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { SongContext, songReducer } from "./SongContextProvider.component"
import { IVoice } from "../../models/IVoice"
import { chords, getNotesFromChord, notes } from "../../models/chords"
import { IBar, IChord } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { ChordType } from "../../models/IChordMenuOptions"
import { chordMenuReducer } from "./ChordMenuOptions.component"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"

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

const heightOfBar = 185

export const SongView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = useParams<{ songId: string }>()
    const { getSong, songInit } = useGetSong(songId)
    const barsPerRow = useBarsPerRow()
    const { putSong } = useUpdateSong(songId)
    const { userInit } = useGetUser()
    const trigger = useScrollTrigger()
    const [selectedChordId, setSelectedChordId] = useState<
        number | undefined | null
    >(undefined)
    const [selectedBarId, setSelectedBarId] = useState<number | undefined>(
        undefined
    )
    const [selectedChordPosition, setSelectedChordPosition] =
        useState<number>(0)
    const chordOptionsRef = useRef() as MutableRefObject<HTMLAnchorElement>

    const [barEditMode, setBarEditMode] = useState(false)
    const [selectedBars, setSelectedBars] = useState<
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    >(undefined)
    const [barsClipboard, setBarsClipboard] = useState<
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    >(undefined)
    const { postCopyBars } = useCopyBars(songId)
    const { postDeleteBars } = useDeleteBars(songId)
    const setValuesForSelectedChord = (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => {
        setSelectedChordId(chordId)
        setSelectedBarId(barId)
        setSelectedChordPosition(position)
    }
    const [song, dispatchSong] = useReducer(songReducer, {
        title: "",
        songId: 0,
        denominator: 4,
        numerator: 4,
        voices: [],
    } as ISong)
    const [chordMenuOptions, dispatchChordMenuOptions] = useReducer(
        chordMenuReducer,
        {
            chordLength: 1,
            chord: "C",
            chordType: ChordType.NOTE,
            chordNotes: ["C"],
        }
    )
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

    const { updateChord } = useUpdateChord(
        songId,
        selectedVoiceId,
        selectedBarId,
        selectedChordId
    )

    const clickOutsideOfBottomBarListener = (e: any) => {
        if (
            e.target.id !== "chordButton" &&
            e.target.id !== "singleChord" &&
            ((chordOptionsRef.current &&
                !chordOptionsRef.current.contains(e.target)) ||
                !chordOptionsRef.current)
        ) {
            setValuesForSelectedChord(undefined, undefined, 0)
        }
    }

    const { deleteChord } = useDeleteChord(
        Number(songId),
        selectedVoiceId === undefined ? 0 : selectedVoiceId,
        selectedBarId === undefined ? 0 : selectedBarId,
        selectedChordId === undefined ? 0 : selectedChordId
    )

    const handleChangeChord = (chord: string) => {
        if (selectedChordId && selectedVoiceId && selectedBarId) {
            makeChordUpdate(
                chord,
                chordMenuOptions.chordLength,
                selectedChordPosition,
                chordMenuOptions.chordType
            )
        } else {
            const notes = getNotesFromChord(chord)
            dispatchChordMenuOptions({
                type: "UPDATE_CHORD",
                chord,
                chordNotes: notes as string[],
            })
        }
    }

    const makeChordUpdate = async (
        chord: string,
        length: number,
        position: number,
        chordType: ChordType,
        chordNotes?: string[]
    ) => {
        const notes = chordNotes
            ? chordNotes
            : chordType === ChordType.NOTE
            ? [chord]
            : getNotesFromChord(chord)
        const chordName = chordType === ChordType.CHORD ? chord : null

        const { error, result } = await updateChord.run({
            position,
            length,
            notes,
            chordName,
        })

        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            dispatchChordMenuOptions({
                type: "UPDATE_OPTIONS",
                menuOptions: {
                    chordLength: length,
                    chord: chord,
                    chordType: chordType,
                    chordNotes: notes as string[],
                },
            })
            setValuesForSelectedChord(
                selectedChordId,
                result.data.barId,
                position
            )
        }
    }

    const handleChangeChordLength = (updatedChordLength: number) => {
        if (selectedChordId && selectedVoiceId && selectedBarId) {
            const selectedBar = selectedVoice?.bars.find(
                (b) => b.barId === selectedBarId
            )
            const note = selectedBar?.chords.find(
                (b) => b.chordId === selectedChordId
            )
            if (selectedBar && note && note.length > updatedChordLength) {
                makeChordUpdate(
                    chordMenuOptions.chord,
                    updatedChordLength,
                    note.position,
                    chordMenuOptions.chordType
                )
            } else if (selectedBar) {
                updateChordLengthIfPossible(
                    reduceChordsAndNotes(selectedBar),
                    updatedChordLength
                )
            }
        } else {
            dispatchChordMenuOptions({
                type: "UPDATE_CHORD_LENGTH",
                length: updatedChordLength,
            })
        }
    }

    const reduceChordsAndNotes = (selectedBar: IBar) => {
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
                        chordName: "",
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

    const updateChordLengthIfPossible = (
        allChords: IChord[],
        updatedChordLength: number
    ) => {
        let indexOfChord = allChords.findIndex(
            (c) => c.chordId === selectedChordId
        )
        let i = 0
        while (i <= updatedChordLength) {
            const start = indexOfChord - i
            const end = start + updatedChordLength
            const interval = allChords.slice(start, end)
            const isOnlyRests =
                interval.findIndex(
                    (currentChord) =>
                        currentChord.chordId !== selectedChordId &&
                        currentChord.notes[0] !== "Z"
                ) === -1
            if (isOnlyRests && interval.length === updatedChordLength) {
                makeChordUpdate(
                    chordMenuOptions.chord,
                    updatedChordLength,
                    start,
                    chordMenuOptions.chordType
                )
                break
            }
            i++
        }
    }

    const handleNoteSelectedChange = (chordType: ChordType) => {
        let chord
        if (chordType === ChordType.NOTE) {
            chord = chordMenuOptions.chord.includes("#")
                ? chordMenuOptions.chord.substring(0, 2)
                : chordMenuOptions.chord.charAt(0)
        } else {
            chord = chordMenuOptions.chord
        }
        if (selectedChordId && selectedVoiceId) {
            makeChordUpdate(
                chord,
                chordMenuOptions.chordLength,
                selectedChordPosition,
                chordType
            )
        } else {
            const notes =
                chordType === ChordType.CHORD
                    ? getNotesFromChord(chord)
                    : [chord]
            dispatchChordMenuOptions({
                type: "UPDATE_OPTIONS",
                menuOptions: {
                    chordLength: chordMenuOptions.chordLength,
                    chord: chord,
                    chordType: chordType,
                    chordNotes: notes as string[],
                },
            })
        }
    }

    const handleChordNotesChange = (clickedNote: string, checked: boolean) => {
        if (!checked && chordMenuOptions.chordNotes.length > 1) {
            const updatedChordNotes = chordMenuOptions.chordNotes.filter(
                (note) => note !== clickedNote
            )
            makeChordUpdate(
                chordMenuOptions.chord,
                chordMenuOptions.chordLength,
                selectedChordPosition,
                ChordType.CHORD,
                updatedChordNotes
            )
        }
        if (checked) {
            const activeChordNotes = getNotesFromChord(chordMenuOptions.chord)
            let activeChordIndex = 0
            let insertIndex = 0

            while (activeChordIndex < activeChordNotes.length) {
                if (activeChordNotes[activeChordIndex] === clickedNote) {
                    break
                }
                if (
                    activeChordNotes[activeChordIndex] ===
                    chordMenuOptions.chordNotes[insertIndex]
                ) {
                    insertIndex++
                }
                activeChordIndex++
            }

            let updatedChordNotes = [...chordMenuOptions.chordNotes]
            updatedChordNotes.splice(insertIndex, 0, clickedNote)

            makeChordUpdate(
                chordMenuOptions.chord,
                chordMenuOptions.chordLength,
                selectedChordPosition,
                ChordType.CHORD,
                updatedChordNotes
            )
        }
    }

    const handleDeleteSelectedChord = async () => {
        if (selectedChordId && selectedVoiceId && selectedBarId) {
            const { error, result } = await deleteChord.run()
            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
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

    const barClicked = (bar: IBar) => {
        if (!selectedBars) {
            setSelectedBars({
                fromPosition: bar.position,
                toPosition: bar.position,
            })
        } else {
            if (bar.position > selectedBars.fromPosition) {
                setSelectedBars({
                    fromPosition: selectedBars.fromPosition,
                    toPosition: bar.position,
                })
            } else if (selectedBars.fromPosition === bar.position) {
                setSelectedBars(undefined)
            } else {
                setSelectedBars({
                    fromPosition: bar.position,
                    toPosition: bar.position,
                })
            }
        }
    }

    const copySelectedBars = () => {
        setBarsClipboard(selectedBars)
        setSelectedBars(undefined)
    }

    const deleteBars = async () => {
        if (selectedBars) {
            const { error, result } = await postDeleteBars.run({
                fromPosition: selectedBars.fromPosition,
                deleteLength:
                    selectedBars.toPosition - selectedBars.fromPosition + 1,
            })

            if (!error && result) {
                setSelectedBars(undefined)
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

    const pasteBars = async (type: "pasteBefore" | "pasteAfter", bar: IBar) => {
        if (barsClipboard) {
            let body
            if (type === "pasteBefore") {
                body = {
                    fromPosition: barsClipboard.fromPosition,
                    copyLength:
                        barsClipboard.toPosition -
                        barsClipboard.fromPosition +
                        1,
                    toPosition: bar.position,
                }
            } else {
                body = {
                    fromPosition: barsClipboard.fromPosition,
                    copyLength:
                        barsClipboard.toPosition -
                        barsClipboard.fromPosition +
                        1,
                    toPosition: bar.position + 1,
                }
            }
            const { error, result } = await postCopyBars.run(body)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

    return (
        <SongContext.Provider
            value={{
                dispatchSong,
                dispatchChordMenuOptions,
                chordMenuOptions,
                setValuesForSelectedChord,
                selectedChordId,
                editBars: {
                    barEditMode: barEditMode,
                    barClicked: barClicked,
                    copyBars: copySelectedBars,
                    barsClipboard: barsClipboard,
                    selectedBars: selectedBars,
                },
            }}
        >
            <ErrorDialog
                isError={getSong.isError}
                error={getSong.error}
                title={t("Modal.getSongError")}
            />

            {selectedVoiceId !== undefined && selectedVoice && (
                <Grid container className={classes.root}>
                    <Slide appear={false} direction="down" in={!trigger}>
                        <Grid container className={classes.header}>
                            <Grid item xs={12}>
                                <SongNavBar
                                    title={song.title}
                                    onTitleBlur={handleTitleBlur}
                                    voiceId={selectedVoiceId}
                                    user={userInit?.email}
                                    setBarEditMode={() => {
                                        setBarEditMode(!barEditMode)
                                        setSelectedBars(undefined)
                                        setBarsClipboard(undefined)
                                    }}
                                    barEditMode={barEditMode}
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
                            pasteBars={pasteBars}
                            deleteBars={deleteBars}
                            lastPage={true}
                        />
                    </Grid>
                </Grid>
            )}
            {selectedVoiceId && (
                <BottomBar
                    onNoteSelectedChange={(chordType) =>
                        handleNoteSelectedChange(chordType)
                    }
                    onChordChange={(chord) => handleChangeChord(chord)}
                    onChordLengthChange={(length) =>
                        handleChangeChordLength(length)
                    }
                    timeSignature={{ denominator, numerator }}
                    addBar={(bar) => dispatchSong({ type: "ADD_BAR", bar })}
                    songId={songId}
                    voiceId={selectedVoiceId}
                    chordDropdownContent={
                        chordMenuOptions.chordType === ChordType.NOTE
                            ? notes
                            : chords
                    }
                    clickOutsideListener={clickOutsideOfBottomBarListener}
                    onChordNotesChange={handleChordNotesChange}
                    deleteSelectedChord={handleDeleteSelectedChord}
                    chordOptionsRef={chordOptionsRef}
                />
            )}
        </SongContext.Provider>
    )
}
