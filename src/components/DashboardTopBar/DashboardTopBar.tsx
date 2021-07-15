import React from "react"
import {
    AppBar,
    Box,
    Grid,
    Hidden,
    makeStyles,
    Typography,
    IconButton,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { ReactComponent as LogoutIcon } from "../../assets/images/LogoutIcon.svg"
import { useGetUser, useLogout } from "../../utils/useApiServiceUsers"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { SearchField } from "./SearchField"

const useStyles = makeStyles(() => ({
    background: {
        background: "transparent",
        boxShadow: "none",
    },
}))

export const DashboardTopBar = (props: {
    onGoHome?: () => void
    searchTerm?: string
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { onGoHome, searchTerm } = props
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
                        <Grid item xs={2}>
                            <DashboardTopBarIcon onGoHome={onGoHome} />
                        </Grid>
                        <Hidden smDown>
                            <Grid item md={1} />
                        </Hidden>
                        <Grid
                            item
                            xs={10}
                            sm={5}
                            md={4}
                            /* style={{ paddingRight: sm ? 32 : 8 }}*/
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
                                <IconButton
                                    disableFocusRipple
                                    onClick={logout.run}
                                    aria-label={t("LoginView.logout")}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Hidden only={[`xs`, `md`, `lg`, `xl`]}>
                            <Grid item sm={4} />
                        </Hidden>
                        <Hidden only={[`xs`, `md`, `lg`, `xl`]}>
                            <Grid item sm={1} />
                        </Hidden>
                        <Grid item xs={12} sm={10} md={3}>
                            <SearchField searchTermInit={searchTerm} />
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
