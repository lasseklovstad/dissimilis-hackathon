import React, { useState, useEffect } from "react"
import { Grid, Typography, Box, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import {
    DashboardButton,
    DashboardLibraryButton,
    DashboardButtonWithAddIconNoLink,
} from "../../components/DashboardButtons/DashboardButtons"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import {
    useGetRecentSongs,
    useGetFilteredSongs,
    usePostSong,
} from "../../utils/useApiServiceSongs"
import { ISong } from "../../models/ISong"
import { InputModal } from "../../components/CustomModal/InputModal.component"
import { SongGrid } from "../../components/songGrid/SongGrid.component"
import { Loading } from "../../components/loading/Loading.component"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

type MusicTacts = {
    id: number
    text: string
}
const marginBottom = 10
const musicTacts: MusicTacts[] = [
    {
        id: 1,
        text: "2/4",
    },
    {
        id: 2,
        text: "3/4",
    },
    {
        id: 3,
        text: "4/4",
    },
    {
        id: 4,
        text: "6/8",
    },
]

export const DashboardView = () => {
    const styles = useStyles()
    const { t } = useTranslation()

    const [dashboardView, setDashboardView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [addSongModalIsOpen, setAddSongModalIsOpen] = useState(false)
    const [timeSignature, setTimeSignature] = useState("")
    const [textFieldInput, setTextFieldInput] = useState<string>("")

    const { postSong } = usePostSong(textFieldInput, timeSignature)
    const history = useHistory()
    const measureText = t("DashboardView:measure")
    const { getRecentSongs, recentSongs } = useGetRecentSongs()
    const { getFilteredSongs, filteredSongs } = useGetFilteredSongs(searchTerm)

    const handleAddSong = async () => {
        setAddSongModalIsOpen(false)
        const { result } = await postSong.run()
        if (result?.status === 201) {
            history.push(`/song/${result.data.id}`)
        }
    }

    const handleOpenAddSongModal = (song: MusicTacts) => {
        setTimeSignature(song.text)
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
                                onBlur={() => {
                                    setTimeout(() => {
                                        setDashboardView(true)
                                    }, 320)
                                }}
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
                                        text={`${song.text}-${measureText}`}
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
                                handleOnCancelClick={() => handleClose()}
                                handleOnSaveClick={() => handleAddSong()}
                                handleClosed={() => handleClose()}
                                modalOpen={addSongModalIsOpen}
                                saveText={t("Modal:create")}
                                cancelText={t("Modal:cancel")}
                                headerText={t("Modal:addSong")}
                                labelText={t("Modal:nameOfSong")}
                                handleChange={(txt) => setTextFieldInput(txt)}
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
