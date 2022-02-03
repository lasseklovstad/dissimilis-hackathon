import React, { useEffect } from "react"
import { Box, Grid, Slide, useScrollTrigger } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { Song } from "../../components/Song/Song.component"
import { useGetSong, useUndoSong } from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { colors } from "../../utils/colors"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"
import { useVoice } from "../../utils/useVoice"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"
import { useBarsPerRow } from "../../utils/useBars"
import { SelectedChordContextProvider } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { ChordMenuOptionsContextProvider } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"

const useStyles = makeStyles({
    root: {
        marginBottom: "200px",
        "@media (max-width: 1080px)": {
            marginBottom: "250px",
        },
        width: "auto",
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

    const { song, dispatchSong } = useSongContext()
    const { denominator, numerator, voices } = song!!
    const { undoSong } = useUndoSong(songId)
    const trigger = useScrollTrigger()

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
        <ChordMenuOptionsContextProvider>
            <SelectedChordContextProvider>
                <ErrorDialog
                    isError={getSong.isError}
                    error={getSong.error}
                    title={t("Dialog.getSongError")}
                />
                {selectedVoiceId !== undefined && selectedVoice && (
                    <Box ml={3} mr={3}>
                        <Slide appear={false} direction="down" in={!trigger}>
                            <Box
                                sx={{
                                    backgroundColor: colors.gray_100,
                                    position: "sticky",
                                    zIndex: 100,
                                    top: "0",
                                    paddingTop: "24px",
                                }}
                            >
                                <SongNavBar
                                    currentUserHasWriteAccess={
                                        song?.currentUserHasWriteAccess
                                    }
                                />
                                <CreateSongTab
                                    updateSong={getSong.run}
                                    onUndo={undo}
                                    undoIsLoading={undoSong.loading}
                                    currentUserHasWriteAccess={
                                        song?.currentUserHasWriteAccess
                                    }
                                />
                            </Box>
                        </Slide>
                        <Song
                            barsPerRow={barsPerRow}
                            voice={selectedVoice}
                            getChordNameFromMainVoice={
                                getChordNameFromMainVoice
                            }
                            timeSignature={{ denominator, numerator }}
                            heightOfBar={heightOfBar}
                            exportMode={false}
                            lastPage
                            currentUserHasWriteAccess={
                                song?.currentUserHasWriteAccess
                            }
                        />
                    </Box>
                )}
                {selectedVoiceId && song?.currentUserHasWriteAccess && (
                    <BottomBar voiceId={selectedVoiceId} />
                )}
            </SelectedChordContextProvider>
        </ChordMenuOptionsContextProvider>
    )
}
