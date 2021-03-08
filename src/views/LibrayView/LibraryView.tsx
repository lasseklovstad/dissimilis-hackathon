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
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { SongGrid } from "../../components/songGrid/SongGrid.component"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

export const LibraryView = () => {
    const styles = useStyles()
    const { t } = useTranslation()
    const [libraryView, setLibraryView] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [orderTerm, setOrderTerm] = useState<"date" | "song" | "user">("date")
    const [orderDescending, setOrderDescending] = useState<boolean>(true)

    const { getAllSongs, allSongsFetched } = useGetAllSongs(
        orderTerm,
        orderDescending
    )
    const [allSongs, setAllSongs] = useState<ISong[] | undefined>()

    const { getFilteredSongs, filteredSongsFetched } = useGetFilteredSongs(
        searchTerm,
        orderTerm,
        orderDescending
    )
    const [filteredSongs, setFilteredSongs] = useState<ISong[] | undefined>()

    useEffect(() => {
        if (allSongsFetched) {
            setAllSongs(allSongsFetched)
        } 
        if (filteredSongsFetched) {
            setFilteredSongs(filteredSongsFetched)
        }
    }, [filteredSongsFetched, allSongsFetched])

    const removeSongFromFilteredSongs = (songId: number) => {
        setFilteredSongs(
            filteredSongs?.filter((song) => {
                return song.songId !== songId
            })
        )
    }

    const removeSongFromAllSongs = (songId: number) => {
        setAllSongs(
            allSongs?.filter((song) => {
                return song.songId !== songId
            })
        )
    }

    const marginBottom = 4

    const handleOnChangeSearch = (searchTermParam: string) => {
        setSearchTerm(searchTermParam)
        setLibraryView(false)
    }

    const handleChangeOrderTerm = (term: "date" | "song" | "user") => {
        if (term === orderTerm || (term !== orderTerm && !orderDescending)) {
            setOrderDescending(!orderDescending)
        }
        setOrderTerm(term)
    }

    return (
        <>
            <ErrorDialog
                isError={getAllSongs.isError}
                error={getAllSongs.error}
            />
            <ErrorDialog
                isError={getFilteredSongs.isError}
                error={getFilteredSongs.error}
            />
            <Box mx={2}>
                <Grid container justify="center" className={styles.container}>
                    <Grid item xs={12}>
                        <Box mb={marginBottom}>
                            <DashboardTopBar onChange={handleOnChangeSearch} />
                        </Box>
                    </Grid>

                    {libraryView ? (
                        <SongGrid
                            title={t("DashboardView:allSongLabel")}
                            songs={allSongs}
                            removeSong={removeSongFromAllSongs}
                            isLoading={getAllSongs.loading}
                            orderTerm={orderTerm}
                            changeOrderTerm={handleChangeOrderTerm}
                            orderDescending={orderDescending}
                        />
                    ) : (
                        <SongGrid
                            title={t("DashboardView:searchSongLabel")}
                            songs={filteredSongs}
                            removeSong={removeSongFromFilteredSongs}
                            isLoading={getFilteredSongs.loading}
                            orderTerm={orderTerm}
                            changeOrderTerm={handleChangeOrderTerm}
                            orderDescending={orderDescending}
                        />
                    )}
                </Grid>
            </Box>
        </>
    )
}
