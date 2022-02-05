import React, { useEffect, useState } from "react"
import { Box, Slide, useScrollTrigger } from "@mui/material"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import { Song } from "../../components/Song/Song.component"
import {
    useGetSong,
    useGetVoice,
    useUndoSong,
} from "../../utils/useApiServiceSongs"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import {
    useSongContext,
    useSongDispatchContext,
} from "../../context/song/SongContextProvider.component"
import { colors } from "../../utils/colors"
import { SongNavBar } from "../../components/SongNavBar/SongNavBar.component"
import { useVoice } from "../../utils/useVoice"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"
import { useBarsPerRow } from "../../utils/useBars"
import { SelectedChordContextProvider } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { ChordMenuOptionsContextProvider } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { SelectedChordListener } from "../../context/selectedChord/SelectedChordListener.component"
import { SongVariantType } from "../../components/Song/SongVariantType"

export const SongView = () => {
    const { t } = useTranslation()
    const { songId: songIdString } = useParams<{ songId: string }>()
    const songId = Number(songIdString)
    const { getSong, songInit } = useGetSong(songId)
    const { song } = useSongContext()
    const { dispatchSong } = useSongDispatchContext()
    const selectedVoice = useVoice(song!!.voices)
    const { songVoiceId: selectedVoiceId } = selectedVoice || {}
    const { voiceInit, getVoice } = useGetVoice(songId, selectedVoiceId)
    const barsPerRow = useBarsPerRow()
    const [barEditMode, setBarEditMode] = useState(false)
    const { denominator, numerator } = song!!
    const { undoSong } = useUndoSong(songId)
    const trigger = useScrollTrigger()

    const { launchSnackbar } = useSnackbarContext()

    const getSongVariant = (): SongVariantType => {
        if (!song.currentUserHasWriteAccess) {
            return "read-only"
        }
        return barEditMode ? "bar-edit" : "normal-edit"
    }

    useEffect(() => {
        if (songInit) {
            dispatchSong({ type: "UPDATE_SONG", song: songInit })
        }
    }, [songInit, dispatchSong])

    useEffect(() => {
        if (voiceInit) {
            dispatchSong({ type: "UPDATE_VOICE", voice: voiceInit })
        }
    }, [voiceInit, dispatchSong])

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
                <SelectedChordListener />
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
                                        song.currentUserHasWriteAccess
                                    }
                                    setBarEditMode={setBarEditMode}
                                    barEditMode={barEditMode}
                                />
                                <CreateSongTab
                                    updateSong={getSong.run}
                                    onUndo={undo}
                                    undoIsLoading={undoSong.loading}
                                    currentUserHasWriteAccess={
                                        song.currentUserHasWriteAccess
                                    }
                                    song={song}
                                />
                            </Box>
                        </Slide>
                        {!getVoice.loading ? (
                            <Song
                                barsPerRow={barsPerRow}
                                voice={selectedVoice}
                                timeSignature={{ denominator, numerator }}
                                heightOfBar={185}
                                lastPage
                                variant={getSongVariant()}
                            />
                        ) : (
                            <LoadingLogo />
                        )}
                    </Box>
                )}
                {selectedVoiceId && song.currentUserHasWriteAccess && (
                    <Box mt={"200px"}>
                        <BottomBar voiceId={selectedVoiceId} songId={songId} />
                    </Box>
                )}
            </SelectedChordContextProvider>
        </ChordMenuOptionsContextProvider>
    )
}
