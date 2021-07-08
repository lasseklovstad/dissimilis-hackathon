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
import { useGetUser, useLogout } from "../../utils/useApiServiceUsers"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { DashboardMenu } from "../DashboardTopBar/DashboardMenu.component"

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
    const searchPlaceholder = t("DashboardView.search")
    const [searchBarFocus, setSearchBarFocus] = useState(false)
    const { onGoHome, searchTerm } = props
    const sm = useMediaQuery("(min-width: 600px)")
    const { logout } = useLogout()
    const { userInit, getUser } = useGetUser()

    return (
        <div>
            <AppBar position="static" className={classes.background}>
                <Box py={3}>
                    <Grid container spacing={2}>
                        <Hidden xsDown>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={1}>
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
                                <Typography
                                    style={{ marginRight: 8 }}
                                    component="div"
                                >
                                    <Loading isLoading={getUser.loading} />
                                    {userInit?.email}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={1} alignItems="center">
                            <IconButton
                                disableFocusRipple
                                onClick={logout.run}
                                aria-label={t("LoginView.logout")}
                            >
                                <LogoutIcon />
                            </IconButton>
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
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            item
                            xs={1}
                        >
                            <DashboardMenu />
                        </Grid>
                    </Grid>
                </Box>
            </AppBar>
            <Loading isLoading={logout.loading} fullScreen />
            <ErrorDialog
                isError={logout.isError}
                error={logout.error}
                title={t("LoginView.logoutError")}
            />
        </div>
    )
}
