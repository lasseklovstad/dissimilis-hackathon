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

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

type MusicTacts = {
    id: number
    text: string
}

export const DashboardView = () => {
    const styles = useStyles()
    const { t } = useTranslation()

    const [dashboardView, setDashboardView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])
    const [recentSongs, setRecentSongs] = useState<ISong[]>([])
    const [addSongModalIsOpen, setAddSongModalIsOpen] = useState(false)
    const [timeSignature, setTimeSignature] = useState("")
    const [textFieldInput, setTextFieldInput] = useState<string>("")

    const postSong = usePostSong(textFieldInput, timeSignature)
    const history = useHistory()
    const measureText = t("DashboardView:measure")
    const getRecentSongs = useGetRecentSongs()
    const getFilteredSongs = useGetFilteredSongs(searchTerm)
    const marginBottom = 10

    useEffect(() => {
        getRecentSongs().then(({ result }) => {
            setRecentSongs(result?.data || [])
        })
    }, [])

    useEffect(() => {
        getFilteredSongs().then(({ result }) => {
            setFilteredSongs(result?.data || [])
        })
    }, [searchTerm])

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

    const handleAddSong = () => {
        setAddSongModalIsOpen(false)
        postSong().then(({ result }) => {
            if (result?.status === 201) {
                history.push(`/song/${result.data.id}`)
            }
        })
    }

    const handleOpenAddSongModal = (song: MusicTacts) => {
        setTimeSignature(song.text)
        setAddSongModalIsOpen(true)
    }

    const handleClose = () => {
        setAddSongModalIsOpen(false)
    }

    return (
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
                        <Grid item xs={12} sm={10} key="newSongContainer">
                            <Box mb={marginBottom}>
                                <Box mb={2}>
                                    <Typography variant="h1">
                                        {t("DashboardView:newSongLabel")}
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {musicTacts.map((song) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            lg={3}
                                            key={song.id}
                                        >
                                            <DashboardButtonWithAddIconNoLink
                                                func={() =>
                                                    handleOpenAddSongModal(song)
                                                }
                                                text={`${song.text}-${measureText}`}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={10} key="recentSongsContainer">
                            <Box mb={marginBottom}>
                                <Box mb={2}>
                                    <Typography variant="h1">
                                        {t("DashboardView:recentSongLabel")}
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {recentSongs.map((song) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            lg={3}
                                            key={song.id}
                                        >
                                            <DashboardButton
                                                text={song.title}
                                                link={`/song/${song.id}`}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        lg={3}
                                        key="library"
                                    >
                                        <DashboardLibraryButton
                                            text={t(
                                                "DashboardView:libraryButton"
                                            )}
                                            link="/library"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
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
                    <Grid item xs={12} sm={10} key="searchSongsContainer">
                        <Box mb={marginBottom}>
                            <Box m={2}>
                                <Typography variant="h1">
                                    {t("DashboardView:searchSongLabel")}
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {filteredSongs?.map((song) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        lg={3}
                                        key={song.id}
                                    >
                                        <DashboardButton
                                            text={song.title}
                                            link={`/song/${song.id}`}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}
