import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISongIndex } from "../../models/ISong"
import { DashboardButton } from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"
import { IGroupIndex } from "../../models/IGroup"
import { IOrganisationIndex } from "../../models/IOrganisation"
import { SearchFilterAutocomplete } from "./SearchFilterAutocomplete.component"

type SongGridProps = {
    title: string | undefined
    songs: ISongIndex[] | undefined
    removeSong: (songId: number) => void
    renameSong: (songId: number, title: string) => void
    isLoading: boolean
    children?: ReactNode
    orderTerm?: string
    changeOrderTerm?: (term: "date" | "song" | "user") => void
    orderDescending?: boolean
    searchFilter?: boolean
    filterTerm?: (IGroupIndex | IOrganisationIndex)[]
    setFilterTerm?: React.Dispatch<
        React.SetStateAction<(IGroupIndex | IOrganisationIndex)[]>
    >
    initialGroupIds?: string[]
    initialOrganisationIds?: string[]
    onSubmitAutocomplete?: (
        newValue: (IGroupIndex | IOrganisationIndex)[]
    ) => void
}

export const SongGrid = (props: SongGridProps) => {
    const {
        songs,
        title,
        isLoading,
        orderTerm,
        changeOrderTerm,
        orderDescending,
        searchFilter,
        initialGroupIds,
        initialOrganisationIds,
        onSubmitAutocomplete,
    } = props

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                <Box m={2}>
                    <Typography variant="h1">{title}</Typography>
                </Box>
                {searchFilter ? (
                    <SearchFilterAutocomplete
                        initialGroupIds={initialGroupIds}
                        initialOrganisationIds={initialOrganisationIds}
                        orderTerm={orderTerm}
                        changeOrderTerm={changeOrderTerm}
                        orderDescending={orderDescending}
                        onSubmit={onSubmitAutocomplete}
                    />
                ) : (
                    ""
                )}
                <Grid container spacing={3}>
                    {songs?.map((song) => (
                        <Grid key={song.songId} item xs={12}>
                            <DashboardButton
                                title={song.title}
                                arrangerEmail={song.arrangerEmail}
                                updatedOn={song.updatedOn}
                                songId={song.songId}
                                removeSong={props.removeSong}
                                renameSong={props.renameSong}
                                link={`/song/${song.songId}`}
                                currentUserHasWriteAccess={
                                    song.currentUserHasWriteAccess
                                }
                            />
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={4} lg={3}>
                        {props.children}
                    </Grid>
                    <Grid item xs={12} sm={4} lg={3}>
                        <Loading isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    )
}
