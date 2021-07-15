import React, { MutableRefObject, useEffect, useRef } from "react"
import { Grid, makeStyles, Slide, useScrollTrigger } from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { useBarsPerRow, useBars } from "../../utils/useBars"
import { Song } from "../../components/Song/Song.component"
import {
    useGetSong,
    useUndoSong,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { useChords } from "../../utils/useChords"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { useSongContext } from "./SongContextProvider.component"
import { IVoice } from "../../models/IVoice"
import { chords, notes } from "../../models/chords"
import { colors } from "../../utils/colors"
import { ChordType } from "../../models/IChordMenuOptions"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"
import { useHotkeys } from "react-hotkeys-hook"

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
    const { undoSong } = useUndoSong(songId)
    const { userInit } = useGetUser()
    const trigger = useScrollTrigger()
    const chordOptionsRef = useRef() as MutableRefObject<HTMLAnchorElement>
    const {
        song,
        dispatchSong,
        chordMenuOptions,
        selectedVoice,
        selectedVoiceId,
        setBarsClipboard,
        setSelectedBars,
        barEditMode,
        setBarEditMode,
    } = useSongContext()

    const { denominator, numerator, voices } = song

    const { pasteBars, deleteBars } = useBars()
    const {
        setValuesForSelectedChord,
        handleChangeChord,
        handleChangeChordLength,
        handleChordNotesChange,
        handleDeleteSelectedChord,
        handleNoteSelectedChange,
    } = useChords()

    const mainVoice = voices.find((voice) => voice.isMain)
    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return mainVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }

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

    useEffect(() => {
        if (songInit) {
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit, dispatchSong])

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

    useHotkeys("ctrl+z", () => {
        undo()
    })

    const undo = async () => {
        const { result, isError } = await undoSong.run()

        if (!isError && result?.data) {
            dispatchSong({ type: "UPDATE_SONG", song: result.data })
        }
    }

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <>
            <ErrorDialog
                isError={getSong.isError}
                error={getSong.error}
                title={t("Dialog.getSongError")}
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
                                    onUndo={undo}
                                    undoIsLoading={undoSong.loading}
                                />
                            </Grid>
                        </Grid>
                    </Slide>
                    <Grid item xs={12} className={classes.body}>
                        <Song
                            barsPerRow={barsPerRow}
                            voice={selectedVoice}
                            getChordNameFromMainVoice={
                                getChordNameFromMainVoice
                            }
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
                    addBar={(song) =>
                        dispatchSong({ type: "UPDATE_SONG", song })
                    }
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
        </>
    )
}
