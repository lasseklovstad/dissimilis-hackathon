import React, { useEffect, useState } from "react"
import { Box, Grid } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useGetFilteredSongs } from "../../utils/useApiServiceSongs"
import { ISongIndex } from "../../models/ISong"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { SongGrid } from "../../components/SongGrid/SongGrid.component"
import { useLocation } from "react-router"
import { updateSongTitleInListOfSongs } from "../../utils/dashboard.util"
import { useNavigate } from "react-router"
import { IOrganisationIndex } from "../../models/IOrganisation"
import { IGroupIndex } from "../../models/IGroup"

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
    const numberOfResults = "50"
    const navigate = useNavigate()
    const location = useLocation()
    const url = new URLSearchParams(location.search)
    const searchTermUrl = url.get("search")
    const searchTerm = searchTermUrl ? searchTermUrl : ""
    const includedOrganisationIdArray = url.getAll("organisationId")
    const includedGroupIdArray = url.getAll("groupId")
    const { getFilteredSongs, filteredSongsFetched } = useGetFilteredSongs(
        searchTerm,
        includedOrganisationIdArray,
        includedGroupIdArray,
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

    const renameSongInFilteredSongs = (songId: number, title: string) => {
        setFilteredSongs(
            updateSongTitleInListOfSongs(filteredSongs, songId, title)
        )
    }

    const handleChangeOrderTerm = (term: "date" | "song" | "user") => {
        if (term === orderTerm || (term !== orderTerm && !orderDescending)) {
            setOrderDescending(!orderDescending)
        }
        setOrderTerm(term)
    }

    const handleAddSearchUrl = (searchTerm: string) => {
        const url = new URLSearchParams(location.search)
        const groupIdsFromUrl = url.getAll("groupId")
        const organisationIdsFromUrl = url.getAll("organisationId")
        const groupValues = groupIdsFromUrl
            .map((groupId) => "groupId=" + groupId)
            .join("&")
        const organisationValues = organisationIdsFromUrl
            .map((organisationId) => "organisationId=" + organisationId)
            .join("&")
        const params = [searchTerm, groupValues, organisationValues].join("&")

        navigate(`/library?search=${params}`)
    }

    const handleAddFilterUrl = (
        newValues: (IGroupIndex | IOrganisationIndex)[]
    ) => {
        const url = new URLSearchParams(location.search)
        const searchTerm = url.get("search")

        const newValueString = newValues
            .map((item) =>
                "groupName" in item
                    ? "groupId=" + item.groupId
                    : "organisationId=" + item.organisationId
            )
            .join("&")

        searchTerm
            ? navigate(`/library?search=${searchTerm}&${newValueString}`)
            : navigate(`/library?${newValueString}`)
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
                <Grid
                    container
                    justifyContent="center"
                    className={styles.container}
                >
                    <Grid item xs={12}>
                        <Box mb={marginBottom}>
                            <DashboardTopBar
                                searchTerm={searchTerm}
                                handleOnSubmitSearch={handleAddSearchUrl}
                            />
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
                        renameSong={renameSongInFilteredSongs}
                        isLoading={getFilteredSongs.loading}
                        orderTerm={orderTerm}
                        changeOrderTerm={handleChangeOrderTerm}
                        orderDescending={orderDescending}
                        searchFilter
                        initialGroupIds={includedGroupIdArray}
                        onSubmitAutocomplete={handleAddFilterUrl}
                    />
                </Grid>
            </Box>
        </>
    )
}
