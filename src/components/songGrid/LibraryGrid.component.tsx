import React, { ReactNode } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { ISong } from "../../models/ISong"
import { DashboardButton } from "../DashboardButtons/DashboardButtons"
import { Loading } from "../loading/Loading.component"

type LibraryGridProps = {
    children?: ReactNode
}

const GridItem = (props: { children: ReactNode }) => {
    return (
        <Grid item xs={12} sm={4} lg={3}>
            {props.children}
        </Grid>
    )
}

export const LibraryGrid = (props: LibraryGridProps) => {
    const {children } = props

    const getChildren = () => {
        if (children) {
            if (Array.isArray(children)) {
                return (
                    <>
                        {children.map((child, i) => {
                            return <GridItem key={i}>{child}</GridItem>
                        })}
                    </>
                )
            }
            return <GridItem>{children}</GridItem>
        }
        return undefined
    }

    return (
        <Grid item xs={12} sm={10}>
            <Box>
                <Grid container >
                    {getChildren()}
                </Grid>
            </Box>
        </Grid>
    )
}
