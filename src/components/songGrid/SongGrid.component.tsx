import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISong } from "../../models/ISong"
import { DashboardButton, SortingButtons } from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"

type SongGridProps = {
    title: string | undefined
    songs: ISong[] | undefined
    removeSong: (songId: number) => void
    isLoading: boolean
    children?: ReactNode
    sorting: boolean
    sortTerm: string
    changeSortTerm: (term: "date" | "song" | "user") => void
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
    const { songs, title, isLoading, children, sorting, sortTerm, changeSortTerm } = props

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
                                arrangerName={song.arrangerName}
                                updatedOn={song.updatedOn}
                                songId={song.songId}
                                removeSong={props.removeSong}
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
        if(sorting) {
            return (
                <>
                    <Grid item xs={11}>
                        <SortingButtons 
                            term={sortTerm} 
                            changeSortTerm={changeSortTerm} 
                            />
                    </Grid>
                </>
            )
        }
        return undefined
    }

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                {getHeader()}
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
