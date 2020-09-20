import React, { useState } from "react"
import { Box, Grid, TextField, AppBar, makeStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"

const useStyles = makeStyles(() => ({
    background: {
        background: "transparent",
        boxShadow: "none",
    },
}))

export const DashboardTopBar = (props: {
    onBlur: () => void
    onChange: (txt: string) => void
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const searchPlaceholder = t("DashboardView:search")
    const [searchBarFocus, setSearchBarFocus] = useState(false)

    const goHome = () => {
        history.push("/dashboard")
    }

    return (
        <div>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Grid item sm={1} />
                        <Grid item xs={2}>
                            <DashboardTopBarIcon onClick={goHome} />
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
                                    props.onBlur()
                                }}
                                onChange={(event) =>
                                    props.onChange(event.target.value)
                                }
                            />
                        </Grid>
                    </Grid>
                </Box>
            </AppBar>
        </div>
    )
}
