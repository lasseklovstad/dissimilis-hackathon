import React, { useEffect, useState } from "react"
import {
    AppBar,
    Box,
    makeStyles,
    TextField,
    Typography,
    useMediaQuery,
    IconButton,
} from "@material-ui/core"
import { MenuButton } from "../MenuButton/MenuButton.component"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { colors } from "../../utils/colors"
import { ReactComponent as LogoutIcon } from "../../assets/images/LogoutIcon.svg"
import { useLogout } from "../../utils/useApiServiceUsers"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        marginBottom: "16px",
    },
    left: {
        order: 1,
    },
    center: {
        order: 2,
        "@media (max-width:600px)": {
            order: 3,
            marginTop: "8px",
        },
    },
    right: {
        order: 3,
        "@media (max-width:600px)": {
            order: 2,
        },
    },
    appbar: {
        backgroundColor: "transparent",
        marginBottom: "16px",
    },
    textFieldInput: {
        fontSize: "30",
    },

    underline: {
        "&:before": {
            borderBottom: "none",
        },
    },

    focused: {
        border: `4px solid ${colors.focus}`,
        borderRadius: 8,
    },

    titleRoot: {
        paddingLeft: 4,
    },
})

export const SongNavBar = (props: {
    title: string
    voiceId: number
    onTitleBlur: (title: string) => void
    user?: string
    setBarEditMode: () => void
    barEditMode: boolean
}) => {
    const classes = useStyles()
    const matches = useMediaQuery("(max-width:600px)")
    const [title, setTitle] = useState(props.title)
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(props.title)
    }, [props.title])

    const { logout } = useLogout()

    return (
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <DashboardTopBarIcon />
                    <Box ml={1} mr={1} width="100%">
                        <TextField
                            InputProps={{
                                style: { fontSize: 24 },
                                classes: {
                                    underline: classes.underline,
                                    focused: classes.focused,
                                    root: classes.titleRoot,
                                },
                                inputProps: {
                                    maxLength: 250,
                                    "aria-label": t("Dialog.nameOfSong"),
                                },
                            }}
                            value={title}
                            onBlur={(ev) => props.onTitleBlur(ev.target.value)}
                            onChange={(ev) => setTitle(ev.target.value)}
                            fullWidth
                        />
                    </Box>
                    {!matches ? (
                        <>
                            <Box ml={4} mr={1}>
                                <Typography>{props.user}</Typography>
                            </Box>
                            <Box mr={4}>
                                <IconButton
                                    disableFocusRipple
                                    onClick={logout.run}
                                    aria-label={t("LoginView.logout")}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : undefined}
                    <MenuButton
                        songTitle={title}
                        voiceId={props.voiceId}
                        showName={matches}
                        user={props.user}
                        setBarEditMode={props.setBarEditMode}
                        barEditMode={props.barEditMode}
                        updateSongTitle={setTitle}
                        onLogout={logout.run}
                    />
                </Box>
            </AppBar>
            <Loading isLoading={logout.loading} fullScreen />
            <ErrorDialog
                isError={logout.isError}
                error={logout.error}
                title={t("LoginView.logoutError")}
            />
        </Box>
    )
}
