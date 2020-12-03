import React, { useState } from "react"
import { Box, Grid, makeStyles } from "@material-ui/core"
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
import { InputModal } from "../../components/CustomModal/InputModal.component"
import { SongGrid } from "../../components/songGrid/SongGrid.component"
import { Loading } from "../../components/loading/Loading.component"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { ITimeSignature } from "../../models/ITimeSignature"
import { getTimeSignatureText } from "../../utils/bar.util"

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
const marginBottom = 10
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
    const [addSongModalIsOpen, setAddSongModalIsOpen] = useState(false)
    const [timeSignature, setTimeSignature] = useState<
        ITimeSignature | undefined
    >()

    const { postSong } = usePostSong()
    const history = useHistory()
    const measureText = t("DashboardView:measure")
    const { getRecentSongs, recentSongs } = useGetRecentSongs()
    const { getFilteredSongs, filteredSongs } = useGetFilteredSongs(searchTerm)

    const handleAddSong = async (title: string) => {
        setAddSongModalIsOpen(false)
        const { result } = await postSong.run({ ...timeSignature, title })
        if (result?.status === 201) {
            history.push(`/song/${result.data.songId}`)
        }
    }

    const handleOpenAddSongModal = (song: MusicTacts) => {
        setTimeSignature(song.timeSignature)
        setAddSongModalIsOpen(true)
    }

    const handleClose = () => {
        setAddSongModalIsOpen(false)
    }

    return (
        <>
            <Box mx={2}>
                <Grid container justify="center" className={styles.container}>
                    <Grid item xs={12}>
                        <Box mb={marginBottom}>
                            <DashboardTopBar
                                onGoHome={() => setDashboardView(true)}
                                onChange={(txt) => {
                                    setSearchTerm(txt)
                                    setDashboardView(false)
                                }}
                            />
                        </Box>
                    </Grid>

                    {dashboardView ? (
                        <>
                            <SongGrid
                                title={t("DashboardView:newSongLabel")}
                                songs={undefined}
                                isLoading={false}
                            >
                                {musicTacts.map((song) => (
                                    <DashboardButtonWithAddIconNoLink
                                        key={song.id}
                                        func={() =>
                                            handleOpenAddSongModal(song)
                                        }
                                        text={`${getTimeSignatureText(
                                            song.timeSignature
                                        )}-${measureText}`}
                                    />
                                ))}
                            </SongGrid>

                            <SongGrid
                                title={t("DashboardView:recentSongLabel")}
                                songs={recentSongs}
                                isLoading={getRecentSongs.loading}
                            >
                                <DashboardLibraryButton
                                    text={t("DashboardView:libraryButton")}
                                    link="/library"
                                />
                            </SongGrid>

                            <InputModal
                                handleOnCancelClick={handleClose}
                                handleOnSaveClick={handleAddSong}
                                handleClosed={handleClose}
                                modalOpen={addSongModalIsOpen}
                                saveText={t("Modal:create")}
                                cancelText={t("Modal:cancel")}
                                headerText={t("Modal:addSong")}
                                labelText={t("Modal:nameOfSong")}
                            />
                        </>
                    ) : (
                        <SongGrid
                            title={t("DashboardView:searchSongLabel")}
                            songs={filteredSongs}
                            isLoading={getFilteredSongs.loading}
                        />
                    )}
                </Grid>
            </Box>
            <Loading isLoading={postSong.loading} fullScreen />
            <ErrorDialog isError={postSong.isError} error={postSong.error} />
        </>
    )
}
