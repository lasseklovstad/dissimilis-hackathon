import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISongIndex } from "../../models/ISong"
import {
    DashboardButton,
    SortingButtons,
} from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"
import { SearchFilterAutocomplete } from "./SongFilter.component"

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
}

const GridItem = (props: { children: ReactNode; isSong: boolean }) => {
    if (props.isSong) {
        return (
            <Grid item xs={12}>
                {props.children}
            </Grid>
        )
    }
    return (
        <Grid item xs={12} sm={4} lg={3}>
            {props.children}
        </Grid>
    )
}

export const SongGrid = (props: SongGridProps) => {
    const {
        songs,
        title,
        isLoading,
        children,
        orderTerm,
        changeOrderTerm,
        orderDescending,
        searchFilter,
    } = props

    const getChildren = () => {
        if (children) {
            if (Array.isArray(children)) {
                return (
                    <>
                        {children.map((child, i) => {
                            return (
                                <GridItem key={i} isSong={false}>
                                    {child}
                                </GridItem>
                            )
                        })}
                    </>
                )
            }
            return <GridItem isSong={false}>{children}</GridItem>
        }
        return undefined
    }

    const getItems = () => {
        if (!isLoading) {
            return (
                <>
                    {getSorting()}
                    {songs?.map((song) => (
                        <GridItem key={song.songId} isSong>
                            <DashboardButton
                                title={song.title}
                                arrangerEmail={song.arrangerEmail}
                                updatedOn={song.updatedOn}
                                songId={song.songId}
                                removeSong={props.removeSong}
                                renameSong={props.renameSong}
                                link={`/song/${song.songId}`}
                            />
                        </GridItem>
                    ))}
                    {getChildren()}
                </>
            )
        }
        return undefined
    }

    const getHeader = () => {
        if (title !== undefined) {
            return (
                <Box m={2}>
                    <Typography variant="h1">{title}</Typography>
                </Box>
            )
        }
        return undefined
    }

    const getSorting = () => {
        if (orderTerm && changeOrderTerm && orderDescending !== undefined) {
            return (
                <Grid item xs={12} role="row">
                    <SortingButtons
                        orderTerm={orderTerm}
                        changeOrderTerm={changeOrderTerm}
                        orderDescending={orderDescending}
                    />
                </Grid>
            )
        }
        return undefined
    }

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                {getHeader()}
                {searchFilter ? <SearchFilterAutocomplete /> : ""}
                <Grid container spacing={3}>
                    {getItems()}
                    <GridItem isSong={false}>
                        <Loading isLoading={isLoading} />
                    </GridItem>
                </Grid>
            </Box>
        </Grid>
    )
}
