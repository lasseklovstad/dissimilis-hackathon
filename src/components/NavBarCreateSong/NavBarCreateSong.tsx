import React from "react";
import { makeStyles, Grid, Typography, AppBar, Box, useMediaQuery } from "@material-ui/core";
import butterflyBlue from "../../assets/images/butterflyBlue.svg";
import MenuButton from "../MenuButton/MenuButton";
import colors from "../../utils/colors";



export type NavBarCreateSongProps = {

}


export const NavBarCreateSong : React.FC<NavBarCreateSongProps> = props => {
    const classes = useStyles();
    const matches = useMediaQuery("(max-width:600px)");
    console.log(matches);


    return(
        <Box className={classes.root} mb={matches ? 2 : 4}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
            <Grid container>
                <Grid item xs={11} sm={1} className={classes.left}>
                    <img src={butterflyBlue} alt="logo" className={classes.image} />
                </Grid>
                <Grid item xs={12} sm={10} className={classes.center}>
                    <Typography variant="h1">Lisa gikk til skolen</Typography>
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
        },
    },
    right: {
        order: 3,
        '@media (max-width:600px)': { 
            order: 2
        },
    },
    image: {
        width: "48px",
        height: "48px",
        backgroundColor: colors.white,
        '@media (max-width:600px)': {
            width: "32px",
            height: "32px",
        },
        
    },
    title: {

    },
    button: {
        
    },
    appbar: {
        backgroundColor: "transparent",
    }, 
});


export default NavBarCreateSong;