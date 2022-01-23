import React from "react"
import { AppBar, Box, Grid, Hidden, Typography } from "@mui/material"

import makeStyles from "@mui/styles/makeStyles"

import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { SearchField } from "./SearchField"
import { DashboardMenu } from "../DashboardTopBar/DashboardMenu.component"
import { useUser } from "../UserContextProvider/UserContextProvider"

const useStyles = makeStyles(() => ({
    background: {
        background: "transparent",
        boxShadow: "none",
    },
}))

export const DashboardTopBar = (props: {
    onGoHome?: () => void
    searchTerm?: string
    handleOnSubmitSearch: (searchTerm: string) => void
}) => {
    const classes = useStyles()
    const { onGoHome, searchTerm, handleOnSubmitSearch } = props
    const { user } = useUser()

    return (
        <>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Hidden smDown>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={1}>
                            <DashboardTopBarIcon onGoHome={onGoHome} />
                        </Grid>
                        <Hidden lgDown>
                            <Grid item md={1} />
                        </Hidden>
                        <Grid item xs={10} sm={7} md={5} lg={4}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                style={{ height: "100%" }}
                            >
                                <Typography
                                    style={{ marginRight: 8 }}
                                    component="div"
                                >
                                    {user.email}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Hidden only={[`xs`, `md`, `lg`, `xl`]}>
                            <Grid item sm={1} />
                        </Hidden>
                        <Hidden only={[`md`, `lg`, `xl`]}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                item
                                xs={1}
                            >
                                <DashboardMenu />
                            </Grid>
                        </Hidden>
                        <Hidden only={[`xs`, `md`, `lg`, `xl`]}>
                            <Grid item sm={1} />
                        </Hidden>
                        <Hidden only={[`xs`, `md`, `lg`, `xl`]}>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={12} sm={10} md={3}>
                            <SearchField
                                searchTermInit={searchTerm}
                                handleOnSubmit={handleOnSubmitSearch}
                            />
                        </Grid>
                        <Hidden only={[`xs`, `sm`]}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                item
                                xs={1}
                            >
                                <DashboardMenu />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Box>
            </AppBar>
        </>
    )
}
