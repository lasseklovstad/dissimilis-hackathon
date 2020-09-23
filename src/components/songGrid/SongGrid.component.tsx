import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISong } from "../../models/ISong"
import { DashboardButton } from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"

type SongGridProps = {
    title: string
    songs: ISong[] | undefined
    isLoading: boolean
    children?: ReactNode
}

const GridItem = (props: { children: ReactNode }) => {
    return (
        <Grid item xs={12} sm={4} lg={3}>
            {props.children}
        </Grid>
    )
}

export const SongGrid = (props: SongGridProps) => {
    const { songs, title, isLoading, children } = props

    const getChildren = () => {
        if (children) {
            if (Array.isArray(children)) {
                return (
                    <>
                        {children.map((child) => {
                            return <GridItem>{child}</GridItem>
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
                        <GridItem key={song.id}>
                            <DashboardButton
                                text={song.title}
                                link={`/song/${song.id.toString()}`}
                            />
                        </GridItem>
                    ))}
                    {getChildren()}
                </>
            )
        }
        return undefined
    }

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                <Box m={2}>
                    <Typography variant="h1">{title}</Typography>
                </Box>
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
