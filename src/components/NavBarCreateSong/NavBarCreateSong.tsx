import React from "react";
import { makeStyles, Box, Grid, Typography, useMediaQuery, Fab, AppBar, Toolbar } from "@material-ui/core";
import butterflyBlue from "../../assets/images/butterflyBlue.svg";
import MenuButton from "../MenuButton/MenuButton";
import colors from "../../utils/colors";
import { DashboardTopBarIcon } from "../DashboardButtons/DashboardButtons";


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    image: {
        width: "48px",
        height: "48px",
        marginRight: "20px",
        backgroundColor: colors.white,
        '@media (max-width:600px)': {
            width: "32px",
            height: "32px",
        },
        
    },
    title: {
    },
    button: {
        float: "right",
    },
    appbar: {
        backgroundColor: "transparent",
    }
});

function NavBarCreateSong() {
    const classes = useStyles();
    const matches = useMediaQuery('(min-width:600px)');
    console.log(matches);

    return(
        <div className={classes.root}>
            <AppBar position="static" elevation={0} className={classes.appbar}>
            <Grid container>
                <Grid item xs={1}>
                    <DashboardTopBarIcon />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h1" className={classes.title}>Lisa gikk til skolen</Typography>
                </Grid>
                <Grid item xs={1}>
                    <MenuButton />
                </Grid>
            </Grid>
        
        </AppBar>
        </div>
    );
};

export default NavBarCreateSong;

    /*
        <Grid container className={classes.root}>
            <Grid item xs={3} sm={2}>
                <img src={butterflyBlue} alt="logo" className={classes.image} />
            </Grid>
            <Grid item xs={8}sm={9}>
                <Typography variant="h1">Lisa gikk til skolen</Typography>
            </Grid>
            <Grid item sm={1}> 
                <MenuButton />
            </Grid>
        </Grid>
    {*/