import React, { useEffect, useState } from "react"
import {
    AppBar,
    Box,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { MenuButton } from "../MenuButton/MenuButton.component"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { colors } from "../../utils/colors"
import { useLogout } from "../../utils/useApiServiceUsers"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { useTranslation } from "react-i18next"
import { useSongContext, useSongDispatchContext } from "../../context/song/SongContextProvider.component"
import { useUpdateSong } from "../../utils/useApiServiceSongs"
import { useUser } from "../UserContextProvider/UserContextProvider"

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
    currentUserHasWriteAccess?: boolean
    barEditMode: boolean
    setBarEditMode: (mode: boolean) => void
}) => {
    const { song } = useSongContext()
    const { dispatchSong } = useSongDispatchContext()
    const { currentUserHasWriteAccess, barEditMode, setBarEditMode } = props
    const classes = useStyles()
    const matches = useMediaQuery("(max-width:600px)")
    const [title, setTitle] = useState(song?.title)
    const { t } = useTranslation()
    const { putSong } = useUpdateSong(song!!.songId)
    const { logout } = useLogout()
    const { user } = useUser()

    useEffect(() => {
        setTitle(song?.title)
    }, [song?.title])

    const handleTitleBlur = async (newTitle: string) => {
        if (newTitle !== song?.title) {
            const { error, result } = await putSong.run({ title: newTitle })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
    }

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
                        {currentUserHasWriteAccess ? (
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
                                onBlur={(ev) =>
                                    handleTitleBlur(ev.target.value)
                                }
                                onChange={(ev) => setTitle(ev.target.value)}
                                fullWidth
                            />
                        ) : (
                            <Typography
                                style={{ fontSize: 24 }}
                                className={classes.titleRoot}
                                aria-label={t("Dialog.nameOfSong")}
                            >
                                {title}
                            </Typography>
                        )}
                    </Box>
                    {!matches ? (
                        <>
                            <Box ml={4} mr={1}>
                                <Typography>{user.email}</Typography>
                            </Box>
                        </>
                    ) : undefined}
                    <MenuButton
                        showName={matches}
                        updateSongTitle={handleTitleBlur}
                        songTitle={song!!.title}
                        currentUserHasWriteAccess={currentUserHasWriteAccess}
                        barEditMode={barEditMode}
                        setBarEditMode={setBarEditMode}
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
