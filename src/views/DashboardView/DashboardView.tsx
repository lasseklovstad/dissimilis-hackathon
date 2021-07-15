import React, { useEffect, useState } from "react"
import { Box, Dialog, Grid, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import {
    DashboardButtonWithAddIconNoLink,
    DashboardLibraryButton,
} from "../../components/DashboardButtons/DashboardButtons"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import {
    useGetFilteredSongs,
    useGetRecentSongs,
    usePostSong,
} from "../../utils/useApiServiceSongs"
import { InputDialog } from "../../components/CustomDialog/InputDialog.component"
import { SongGrid } from "../../components/songGrid/SongGrid.component"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { ITimeSignature } from "../../models/ITimeSignature"
import { getTimeSignatureText } from "../../utils/bar.util"
import { ISongIndex } from "../../models/ISong"
import { Loading } from "../../components/loading/Loading.component"
import { updateSongTitleInListOfSongs } from "../../utils/dashboard.util"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

type MusicTacts = {
    id: number
    timeSignature: {
        numerator: number
        denominator: number
    }
}
const marginBottom = 4
const musicTacts: MusicTacts[] = [
    {
        id: 1,
        timeSignature: {
            numerator: 2,
            denominator: 4,
        },
    },
    {
        id: 2,
        timeSignature: {
            numerator: 3,
            denominator: 4,
        },
    },
    {
        id: 3,
        timeSignature: {
            numerator: 4,
            denominator: 4,
        },
    },
    {
        id: 4,
        timeSignature: {
            numerator: 6,
            denominator: 8,
        },
    },
]

export const DashboardView = () => {
    const styles = useStyles()
    const { t } = useTranslation()

    const [dashboardView, setDashboardView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [addSongDialogIsOpen, setAddSongDialogIsOpen] = useState(false)
    const [orderTerm, setOrderTerm] = useState<"date" | "song" | "user">("date")
    const [orderDescending, setOrderDescending] = useState<boolean>(true)
    const [timeSignature, setTimeSignature] = useState<
        ITimeSignature | undefined
    >()

    const { postSong } = usePostSong()
    const history = useHistory()
    const measureText = t("DashboardView.measure")

    const { getRecentSongs, recentSongsFetched } = useGetRecentSongs(
        orderTerm,
        orderDescending
    )
    const [recentSongs, setRecentSongs] = useState<ISongIndex[] | undefined>()

    const { getFilteredSongs, filteredSongsFetched } = useGetFilteredSongs(
        searchTerm,
        orderTerm,
        orderDescending
    )
    const [filteredSongs, setFilteredSongs] = useState<
        ISongIndex[] | undefined
    >()

    useEffect(() => {
        if (recentSongsFetched) {
            setRecentSongs(recentSongsFetched)
        }
        if (filteredSongsFetched) {
            setFilteredSongs(filteredSongsFetched)
        }
    }, [recentSongsFetched, filteredSongsFetched])

    const removeSongFromRecentSongs = (songId: number) => {
        setRecentSongs(
            recentSongs?.filter((song) => {
                return song.songId !== songId
            })
        )
    }

    const removeSongFromFilteredSongs = (songId: number) => {
        setFilteredSongs(
            filteredSongs?.filter((song) => {
                return song.songId !== songId
            })
        )
    }

    const renameSongInRecentSongs = (songId: number, title: string) => {
        setRecentSongs(updateSongTitleInListOfSongs(recentSongs, songId, title))
    }

    const renameSongInFilteredSongs = (songId: number, title: string) => {
        setFilteredSongs(
            updateSongTitleInListOfSongs(filteredSongs, songId, title)
        )
    }

    const handleAddSong = async (title: string) => {
        setAddSongDialogIsOpen(false)
        const { result } = await postSong.run({ ...timeSignature, title })
        if (result?.status === 201) {
            history.push(`/song/${result.data.songId}`)
        }
    }

    const handleOpenAddSongDialog = (song: MusicTacts) => {
        setTimeSignature(song.timeSignature)
        setAddSongDialogIsOpen(true)
    }

    const handleClose = () => {
        setAddSongDialogIsOpen(false)
    }

    const handleChangeOrderTerm = (term: "date" | "song" | "user") => {
        if (term === orderTerm || (term !== orderTerm && !orderDescending)) {
            setOrderDescending(!orderDescending)
        }
        if (term !== orderTerm) {
            setOrderTerm(term)
        }
    }

    return (
        <>
            <Loading isLoading={postSong.loading} fullScreen />
            <Box mx={2}>
                <Grid container justify="center" className={styles.container}>
                    <Grid item xs={12}>
                        <Box mb={marginBottom}>
                            <DashboardTopBar
                                onGoHome={() => {
                                    setSearchTerm("")
                                    setDashboardView(true)
                                }}
                                onChange={(txt) => {
                                    setSearchTerm(txt)
                                    setDashboardView(false)
                                }}
                                searchTerm={searchTerm}
                            />
                        </Box>
                    </Grid>

                    {dashboardView ? (
                        <>
                            <SongGrid
                                title={t("DashboardView.newSongLabel")}
                                songs={undefined}
                                removeSong={() => undefined}
                                renameSong={() => undefined}
                                isLoading={false}
                            >
                                {musicTacts.map((song) => (
                                    <DashboardButtonWithAddIconNoLink
                                        key={song.id}
                                        func={() =>
                                            handleOpenAddSongDialog(song)
                                        }
                                        text={`${getTimeSignatureText(
                                            song.timeSignature
                                        )}-${measureText}`}
                                    />
                                ))}
                            </SongGrid>

                            <SongGrid
                                title={t("DashboardView.recentSongLabel")}
                                songs={recentSongs}
                                removeSong={removeSongFromRecentSongs}
                                renameSong={renameSongInRecentSongs}
                                isLoading={getRecentSongs.loading}
                            >
                                <DashboardLibraryButton
                                    text={t("DashboardView.allSongLabel")}
                                    link="/library"
                                />
                            </SongGrid>

                            <Dialog
                                open={addSongDialogIsOpen}
                                onClose={handleClose}
                                aria-label={t("Dialog.addSong")}
                                maxWidth="sm"
                                fullWidth
                            >
                                <InputDialog
                                    handleOnCancelClick={handleClose}
                                    handleOnSaveClick={handleAddSong}
                                    saveText={t("Dialog.create")}
                                    cancelText={t("Dialog.cancel")}
                                    headerText={t("Dialog.addSong")}
                                    labelText={t("Dialog.nameOfSong")}
                                    isLoading={postSong.loading}
                                />
                            </Dialog>
                        </>
                    ) : (
                        <SongGrid
                            title={t("DashboardView.searchSongLabel")}
                            songs={filteredSongs}
                            removeSong={removeSongFromFilteredSongs}
                            renameSong={renameSongInFilteredSongs}
                            isLoading={getFilteredSongs.loading}
                            orderTerm={orderTerm}
                            changeOrderTerm={handleChangeOrderTerm}
                            orderDescending={orderDescending}
                        />
                    )}
                </Grid>
            </Box>
            <ErrorDialog isError={postSong.isError} error={postSong.error} />
        </>
    )
}
