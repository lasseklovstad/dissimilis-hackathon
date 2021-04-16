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
    IconButton,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { ReactComponent as LogoutIcon } from "../../assets/images/LogoutIcon.svg"
import { useHistory } from "react-router"
import { useLogout } from "../../utils/useApiServiceUsers"

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
    const history = useHistory()
    const axiosGet = useLogout()

    const onLogout = () => {
        axiosGet().then(() => {
            sessionStorage.clear()
            history.replace("/login")
        })
    }

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
                        {searchBarFocus ? undefined : (
                            <Hidden smDown>
                                <Grid item md={1} />
                            </Hidden>
                        )}
                        <Grid
                            item
                            xs={10}
                            sm={5}
                            md={4}
                            style={{ paddingRight: sm ? 32 : 8 }}
                        >
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                style={{ height: "100%" }}
                            >
                                <Typography style={{ marginRight: 8 }}>
                                    {props.user}
                                </Typography>
                                <IconButton onClick={onLogout}>
                                    <LogoutIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={3} md={searchBarFocus ? 4 : 3}>
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
