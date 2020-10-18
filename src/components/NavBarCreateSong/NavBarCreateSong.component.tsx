import React, { useEffect, useState } from "react"
import {
    AppBar,
    Box,
    Grid,
    makeStyles,
    TextField,
    useMediaQuery,
} from "@material-ui/core"
import { useHistory } from "react-router"
import { MenuButton } from "../MenuButton/MenuButton.component"
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons"

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
    textField: {
        width: "100%",
        height: "36px",
    },
    textFieldInput: {
        fontSize: "30",
    },
})

export const NavBarCreateSong = (props: {
    title: string
    onTitleBlur: (title: string) => void
}) => {
    const classes = useStyles()
    const matches = useMediaQuery("(max-width:600px)")
    const [title, setTitle] = useState(props.title)
    const history = useHistory()

    useEffect(() => {
        setTitle(props.title)
    }, [props.title])

    const goHome = () => {
        history.push("/dashboard")
    }

    return (
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
                <Grid container>
                    <Grid item xs={11} sm={1} className={classes.left}>
                        <DashboardTopBarIcon onClick={goHome} />
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.center}>
                        <TextField
                            inputProps={{ style: { fontSize: 24 } }}
                            value={title}
                            onBlur={(ev) => props.onTitleBlur(ev.target.value)}
                            onChange={(ev) => setTitle(ev.target.value)}
                            className={classes.textField}
                        />
                    </Grid>
                    <Grid item xs={1} sm={1} className={classes.right}>
                        <MenuButton />
                    </Grid>
                </Grid>
            </AppBar>
        </Box>
    )
}
