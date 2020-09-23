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

    const {
        getAllSongs,
        allSongs
    } = useGetAllSongs()
    const {
        getFilteredSongs,
        filteredSongs
    } = useGetFilteredSongs(searchTerm)
    const marginBottom = 4

    useEffect(() => {
        getAllSongs.run()
    }, [getAllSongs])

    useEffect(() => {
        getFilteredSongs.run()
    }, [getFilteredSongs])

    const handleOnBlurSearch = () => {
        setTimeout(() => {
            setLibraryView(true)
        }, 320)
    }

    const handleOnChangeSearch = (searchTermParam: string) => {
        setSearchTerm(searchTermParam)
        setLibraryView(false)
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
                            <DashboardTopBar
                                onBlur={handleOnBlurSearch}
                                onChange={handleOnChangeSearch}
                            />
                        </Box>
                    </Grid>

                    {libraryView ? (
                        <SongGrid
                            title={t("DashboardView:allSongLabel")}
                            songs={allSongs}
                            isLoading={getAllSongs.loading}
                        />
                    ) : (
                        <SongGrid
                            title={t("DashboardView:searchSongLabel")}
                            songs={filteredSongs}
                            isLoading={getFilteredSongs.loading}
                        />
                    )}
                </Grid>
            </Box>
        </>
    )
}
