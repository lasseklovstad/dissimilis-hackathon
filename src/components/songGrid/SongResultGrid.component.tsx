import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISong } from "../../models/ISong"
import { DashboardButton } from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"

type SongGridProps = {
    title: string | undefined
    songs: ISong[] | undefined
    isLoading: boolean
    children?: ReactNode
}

const GridItem = (props: { children: ReactNode}) => {
    return (
        <Grid item xs={12} sm={11} lg={11}>
            {props.children}
        </Grid>
    )
}

export const SongResultGrid = (props: SongGridProps) => {
    const { songs, title, isLoading, children } = props

    const getChildren = () => {
        if (children) {
            if (Array.isArray(children)) {
                return (
                    <>
                        {children.map((child, i) => {
                            return (
                                <GridItem key={i}>
                                    {child}
                                </GridItem>
                            )
                        })}
                    </>
                )
            }
            return <GridItem>{children}</GridItem>
        }
        return undefined
    }

    const getItems = () => {
        if (!isLoading) {
            return (
                <>
                    {songs?.map((song) => (
                        <GridItem key={song.songId}>
                            <DashboardButton
                                title={song.title}
                                arrangerName={song.arrangerName}
                                updatedOn={song.updatedOn}
                                songId={song.songId}
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

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                {getHeader()}
                <Grid container spacing={3}>
                    {getItems()}
                    <GridItem>
                        <Loading isLoading={isLoading} />
                    </GridItem>
                </Grid>
            </Box>
        </Grid>
    )
}