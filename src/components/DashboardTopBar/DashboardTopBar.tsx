import React, { useState } from "react"
import { AppBar, Box, Grid, Hidden, makeStyles, TextField } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"

const useStyles = makeStyles(() => ({
    background: {
        background: "transparent",
        boxShadow: "none",
    },
}))

export const DashboardTopBar = (props: {
    onChange: (txt: string) => void
    onGoHome?: () => void
    searchTerm?: string
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView:search")
    const [searchBarFocus, setSearchBarFocus] = useState(false)
    const { onGoHome, searchTerm } = props

    return (
        <div>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Hidden xsDown>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={2} >
                            <DashboardTopBarIcon onGoHome={onGoHome} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sm={searchBarFocus ? 2 : 5}
                            md={searchBarFocus ? 3 : 5}
                        />
                        <Grid
                            item
                            xs={12}
                            sm={searchBarFocus ? 6 : 3}
                            md={searchBarFocus ? 5 : 3}
                        >
                            <TextField
                                id="standard-basic"
                                label={searchPlaceholder}
                                variant="outlined"
                                type="search"
                                fullWidth
                                onFocus={() => {
                                    setSearchBarFocus(true)
                                }}
                                onBlur={() => {
                                    setSearchBarFocus(false)
                                }}
                                onChange={(event) =>
                                    props.onChange(event.target.value)
                                }
                                value={searchTerm}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </AppBar>
        </div>
    )
}
