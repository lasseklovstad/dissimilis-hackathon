import React, { useEffect, useState } from "react"
import { Box, Grid, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useGetFilteredSongs } from "../../utils/useApiServiceSongs"
import { ISongIndex } from "../../models/ISong"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { SongGrid } from "../../components/songGrid/SongGrid.component"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

export const LibraryView = () => {
    const marginBottom = 4
    const styles = useStyles()
    const { t } = useTranslation()
    const [orderTerm, setOrderTerm] = useState<"date" | "song" | "user">("date")
    const [orderDescending, setOrderDescending] = useState<boolean>(true)

    const url = new URLSearchParams(window.location.search)
    const searchTermUrl = url.get("search")
    const searchTerm = searchTermUrl ? searchTermUrl : ""
    const numberOfResults = "50"

    const { getFilteredSongs, filteredSongsFetched } = useGetFilteredSongs(
        searchTerm,
        orderTerm,
        orderDescending,
        numberOfResults
    )
    const [filteredSongs, setFilteredSongs] = useState<
        ISongIndex[] | undefined
    >()

    useEffect(() => {
        if (filteredSongsFetched) {
            setFilteredSongs(filteredSongsFetched)
        }
    }, [filteredSongsFetched])

    const removeSongFromFilteredSongs = (songId: number) => {
        setFilteredSongs(
            filteredSongs?.filter((song) => {
                return song.songId !== songId
            })
        )
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
                isError={getFilteredSongs.isError}
                error={getFilteredSongs.error}
            />
            <ErrorDialog
                isError={getFilteredSongs.isError}
                error={getFilteredSongs.error}
            />
            <Box mx={2}>
                <Grid container justify="center" className={styles.container}>
                    <Grid item xs={12}>
                        <Box mb={marginBottom}>
                            <DashboardTopBar searchTerm={searchTerm} />
                        </Box>
                    </Grid>
                    <SongGrid
                        title={
                            searchTerm
                                ? t("LibraryView.searchHeading") + searchTerm
                                : t("LibraryView.defaultHeading")
                        }
                        songs={filteredSongs}
                        removeSong={removeSongFromFilteredSongs}
                        isLoading={getFilteredSongs.loading}
                        orderTerm={orderTerm}
                        changeOrderTerm={handleChangeOrderTerm}
                        orderDescending={orderDescending}
                    />
                </Grid>
            </Box>
        </>
    )
}
