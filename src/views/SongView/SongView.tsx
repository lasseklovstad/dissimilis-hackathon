import React, { MutableRefObject, useEffect, useRef } from "react"
import { Grid, makeStyles, Slide, useScrollTrigger } from "@material-ui/core"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { Song } from "../../components/Song/Song.component"
import { useGetSong, useUndoSong } from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { useSongContext } from "./SongContextProvider.component"
import { chords, notes } from "../../models/chords"
import { colors } from "../../utils/colors"
import { ChordType } from "../../models/IChordMenuOptions"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"
import { useVoice } from "../../utils/useVoice"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"
import { useBarsPerRow } from "../../utils/useBars"

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
    const { songId: songIdString } = useParams<{ songId: string }>()
    const songId = Number(songIdString)
    const { getSong, songInit } = useGetSong(songId)
    const barsPerRow = useBarsPerRow()

    const { song, dispatchSong, chordMenuOptions } = useSongContext()
    const { denominator, numerator, voices } = song!!
    const { undoSong } = useUndoSong(songId)
    const trigger = useScrollTrigger()
    const chordOptionsRef = useRef() as MutableRefObject<HTMLAnchorElement>

    const { launchSnackbar } = useSnackbarContext()

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

    useEffect(() => {
        if (songInit) {
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit, dispatchSong])

    const selectedVoice = useVoice(song!!.voices)

    const { songVoiceId: selectedVoiceId } = selectedVoice || {}

    const undo = async () => {
        const { result, isError } = await undoSong.run()

        if (!isError && result?.data) {
            dispatchSong({ type: "UPDATE_SONG", song: result.data })
        } else {
            launchSnackbar(t("Snackbar.undoError"), true)
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
                                    currentUserHasWriteAccess={
                                        song?.currentUserHasWriteAccess
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CreateSongTab
                                    onUndo={undo}
                                    undoIsLoading={undoSong.loading}
                                    currentUserHasWriteAccess={
                                        song?.currentUserHasWriteAccess
                                    }
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
                            lastPage={true}
                            currentUserHasWriteAccess={
                                song?.currentUserHasWriteAccess
                            }
                        />
                    </Grid>
                </Grid>
            )}
            {selectedVoiceId && song?.currentUserHasWriteAccess && (
                <BottomBar
                    voiceId={selectedVoiceId}
                    chordDropdownContent={
                        chordMenuOptions?.chordType === ChordType.NOTE
                            ? notes
                            : chords
                    }
                    chordOptionsRef={chordOptionsRef}
                />
            )}
        </>
    )
}
