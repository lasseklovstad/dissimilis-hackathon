import React, { useContext, useState } from "react";
import { makeStyles, Grid, Typography, AppBar, Box, useMediaQuery, TextField } from "@material-ui/core";
import MenuButton from "../MenuButton/MenuButton";
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons";
import { SongContext } from "../../views/SongView/SongContextProvider.component";



export type NavBarCreateSongProps = {
    saveSongFunc: Function
}


export const NavBarCreateSong: React.FC<NavBarCreateSongProps> = props => {
    const classes = useStyles();
    const matches = useMediaQuery("(max-width:600px)");
    const [changing, setChanging] = useState(false);

    const { song: { title }, changeTitle } = useContext(SongContext);


    const [newTitle, setNewTitle] = useState(title)


    const handleChange = (e: any) => {
        setNewTitle(e.target.value)
    }


    const pressDown = (e: any) => {
        if (e.keyCode === 13) {
            if (e.target.value !== "") {
                changeTitle(e.target.value);
            }
            setChanging(!changing);
        }
        if (e.keyCode === 27) {
            setChanging(false)
        }
    }

    return (
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
                <Grid container>
                    <Grid item xs={11} sm={1} className={classes.left}>
                        <DashboardTopBarIcon func={props.saveSongFunc} />
                    </Grid>
                    <Grid item xs={12} sm={10} className={classes.center}>
                        <Box onClick={() => setChanging(!changing)}>
                            {changing ? <TextField error={newTitle === ""} onChange={(e) => handleChange(e)} inputProps={{ style: { fontSize: 24 } }} value={newTitle} className={classes.textField} autoFocus onKeyDown={(e) => pressDown(e)} ></TextField> : <Typography variant="h2">{title}</Typography>}
                        </Box>
                    </Grid>
                    <Grid item xs={1} sm={1} className={classes.right} >
                        <MenuButton />
                    </Grid>
                </Grid>

            </AppBar>
        </Box>
    );
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    left: {
        order: 1,
    },
    center: {
        order: 2,
        '@media (max-width:600px)': {
            order: 3,
            marginTop: "8px",
        },
    },
    right: {
        order: 3,
        '@media (max-width:600px)': {
            order: 2
        },
    },
    appbar: {
        backgroundColor: "transparent",
    },
    textField: {
        width: "100%",
        height: "36px",
    },
    textFieldInput: {
        fontSize: "30",
    }
});


export default NavBarCreateSong;