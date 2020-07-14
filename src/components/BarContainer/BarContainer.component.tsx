import React, { useContext } from "react";
import { makeStyles, Grid, Box, Button, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import Bar from "../Bar/Bar.component";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { SongContext } from "../../views/SongView/SongContextProvider.component";


export type BarContainerProps = {
    barLineBefore: boolean,
    barLineAfter: boolean,
    barID: string,
};

export const BarContainer: React.FC<BarContainerProps> = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const { deleteBar, getBar, duplicateBar } = useContext(SongContext);
    let bar = getBar(props.barID);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (method: string) => {

        if (method === "delete") {
            deleteBar(props.barID);
        }
        if (method === "duplicate") {
            duplicateBar(props.barID);
        }
        setAnchorEl(null);
    };

    if (bar === undefined) {
        return <></>
    } else {
        let centerDivSize: 10 | 11 | 12 = 10;
        if (bar.barLineBefore && bar.barLineAfter) {
            centerDivSize = 10;
        } else {
            centerDivSize = 11;
        }

        return (
            <Grid container role="grid">
                <Grid item xs={12} className={classes.firstRow} role="row">
                    <Grid container style={{ height: "100%" }} role="grid" aria-label="barline before the bar">
                        <Grid item xs={bar.barLineBefore ? 1 : "auto"} className={classes.barlineBox} style={{ borderRight: bar.barLineBefore ? "2px solid black" : "0" }} role="gridcell">
                        </Grid>
                        <Grid item xs={centerDivSize} role="gridcell" aria-label="the bar">
                            <Bar barID={props.barID} />
                        </Grid>
                        <Grid item xs={bar.barLineAfter ? 1 : "auto"} className={classes.barlineBox} style={{ borderLeft: bar.barLineAfter ? "2px solid black" : "0" }} role="gridcell" aria-label="barline after the bar"></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.secondRow} role="row" >
                    <Grid container style={{ height: "100%" }} role="grid" >
                        <Grid item xs={bar.barLineBefore ? 1 : "auto"} role="gridcell" ></Grid>
                        <Grid item xs={10} role="gridcell" >
                            <Box display="flex" flexGrow={1}>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} role="button" aria-label="button to make changes to the bar">
                                    <MoreHorizIcon style={{ marginLeft: "0px" }} />
                                </Button>
                                <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} role="menu">
                                    <MenuItem onClick={() => handleClose("delete")}>Slett takt </MenuItem>
                                    <MenuItem onClick={() => handleClose("duplicate")}>Dupliser takt </MenuItem>
                                </Menu>
                            </Box>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </Grid>
            </Grid>

        );
    }

}

const useStyles = makeStyles({
    firstRow: {
        height: "auto",

    },
    secondRow: {
        height: "50px",
    },
    barline: {
        backgroundColor: colors.black,
        width: "2px",
        borderRight: 0,
        borderLeft: 0,
    },
    barlineBox: {
        height: "120px",
        marginTop: "40px",
    }

});

export default BarContainer;
