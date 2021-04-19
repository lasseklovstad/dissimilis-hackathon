import React, { useState } from "react"
import {
    AppBar,
    Box,
    Grid,
    Hidden,
    makeStyles,
    TextField,
    Typography,
    useMediaQuery,
} from "@material-ui/core"
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
    user?: string
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const searchPlaceholder = t("DashboardView:search")
    const [searchBarFocus, setSearchBarFocus] = useState(false)
    const { onGoHome, searchTerm } = props
    const sm = useMediaQuery("(min-width: 600px)")

    return (
        <div>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Hidden xsDown>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={2}>
                            <DashboardTopBarIcon onGoHome={onGoHome} />
                        </Grid>
                        <Hidden smDown>
                            <Grid item md={searchBarFocus ? 1 : 3} />
                        </Hidden>
                        <Grid
                            item
                            xs={10}
                            sm={searchBarFocus ? 3 : 5}
                            md={2}
                            style={{ paddingRight: sm ? 32 : 8 }}
                        >
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                style={{ height: "100%" }}
                            >
                                <Typography>{props.user}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={searchBarFocus ? 5 : 3}
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
