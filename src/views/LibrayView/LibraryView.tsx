import React, { useState, useEffect } from "react"
import { Grid, Typography, Box, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardButton } from "../../components/DashboardButtons/DashboardButtons"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import {
    useGetFilteredSongs,
    useGetAllSongs,
} from "../../utils/useApiServiceSongs"
import { ISong } from "../../models/ISong"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

export const LibraryView = () => {
    const styles = useStyles()
    const { t } = useTranslation()
    const [libraryView, setLibraryView] = useState(true)
    const [allSongs, setAllSongs] = useState<ISong[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])
    const [, setClickedSong] = useState<number>(-1)

    const getAllSongs = useGetAllSongs()
    const getFilteredSongs = useGetFilteredSongs(searchTerm)
    const marginBottom = 4

    useEffect(() => {
        getAllSongs().then(({ result }) => {
            setAllSongs(result?.data || [])
        })
    }, [])
    useEffect(() => {
        getFilteredSongs().then(({ result }) => {
            setFilteredSongs(result?.data || [])
        })
    }, [searchTerm])

    const handleOnBlurSearch = () => {
        setTimeout(() => {
            setLibraryView(true)
        }, 320)
    }

    const handleOnChangeSearch = (searchTermParam: string) => {
        setSearchTerm(searchTermParam)
        setLibraryView(false)
    }

    const initialState = {
        mouseX: null,
        mouseY: null,
    }
    const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
        mouseX: null | number
        mouseY: null | number
    }>(initialState)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        setRightClickCoordinates({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        })
    }
    return (
        <Box mx={2}>
            <Grid container justify="center" className={styles.container}>
                <Grid item xs={12}>
                    <Box mb={marginBottom}>
                        <DashboardTopBar
                            onBlur={handleOnBlurSearch}
                            onChange={handleOnChangeSearch}
                        />
                    </Box>
                </Grid>

                {libraryView ? (
                    <Grid item xs={12} sm={10} key="allSongsContainer">
                        <Box mb={marginBottom}>
                            <Box m={2}>
                                <Typography variant="h1">
                                    {t("DashboardView:allSongLabel")}
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {allSongs?.map((song) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        lg={3}
                                        key={song.id}
                                    >
                                        <DashboardButton
                                            onContextMenu={(e) => {
                                                handleOpenMenu(e)
                                            }}
                                            text={song.title}
                                            link={`/song/${song.id!.toString()}`}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
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
                                            onContextMenu={(e) => {
                                                handleOpenMenu(e)
                                            }}
                                            text={song.title}
                                            link={`/song/${song.id!.toString()}`}
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
