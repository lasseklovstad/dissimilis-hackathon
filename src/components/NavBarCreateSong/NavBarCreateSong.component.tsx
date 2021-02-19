import React, { useEffect, useState } from "react"
import {
    AppBar,
    Box,
    makeStyles,
    TextField,
    useMediaQuery,
} from "@material-ui/core"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import { MenuButton } from "../MenuButton/MenuButton.component"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"
import { colors } from "../../utils/colors"

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
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
        marginBottom: "24px",
    },
    textFieldInput: {
        fontSize: "30",
    },

    underline:{
        "&:before": {
            borderBottom: "none",
        },
    },

    focused: {
        border: `4px solid ${colors.focus}`,
        borderRadius: 8
    },

    titleRoot: {
        paddingLeft: 4
    }
})

export const NavBarCreateSong = (props: {
    title: string
    onTitleBlur: (title: string) => void
}) => {
    const classes = useStyles()
    const matches = useMediaQuery("(max-width:600px)")
    const [title, setTitle] = useState(props.title)
    const history = useHistory()
    const { t } = useTranslation()

    useEffect(() => {
        setTitle(props.title)
    }, [props.title])

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
                                classes: {underline: classes.underline, focused: classes.focused, root: classes.titleRoot}
                            }}
                            value={title}
                            onBlur={(ev) => props.onTitleBlur(ev.target.value)}
                            onChange={(ev) => setTitle(ev.target.value)}
                            fullWidth
                        />
                    </Box>
                    <MenuButton />
                </Box>
            </AppBar>
        </Box>
    )
}
