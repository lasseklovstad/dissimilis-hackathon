import React from "react";
import { makeStyles, Grid, Box, Button, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import Bar from "../Bar/Bar.component";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


export type BarContainerProps = {
    barLineBefore: boolean,
    barLineAfter: boolean,
    house?: number,
    repBefore: boolean,
    repAfter: boolean,
    notes: string[],

}

export const BarContainer: React.FC<BarContainerProps> = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let centerDivSize: 10 | 11 | 12 = 10;
    if (props.barLineBefore && props.barLineAfter) {
        centerDivSize = 10;
    } else {
        centerDivSize = 11;
    }

    return (
        <Grid container role="grid" aria-label="BarContainerMainContainer">
            <Grid item xs={12} className={classes.firstRow} role="row" aria-label="BarContainerFirstRow">
                <Grid container style={{ height: "100%" }} role="grid" aria-label="BarContainerFirstRowMainContainer">
                    <Grid item xs={props.barLineBefore ? 1 : "auto"} className={classes.barlineBox} style={{ borderRight: props.barLineBefore ? "2px solid black" : "0" }} role="gridcell" aria-label="BarContainerFirstRowBarLineBefore">
                    </Grid>
                    <Grid item xs={centerDivSize} role="gridcell" aria-label="BarContainerFirstRowBarContainer">
                        <Bar house={props.house} repBefore={props.repBefore} repAfter={props.repAfter} notes={props.notes} />
                    </Grid>
                    <Grid item xs={props.barLineAfter ? 1 : "auto"} className={classes.barlineBox} style={{ borderLeft: props.barLineAfter ? "2px solid black" : "0" }} role="gridcell" aria-label="BarContainerFirstRowBarLineAfter"></Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.secondRow} role="row" aria-label="BarContainerSecondRow">
                <Grid container style={{ height: "100%" }} role="grid" aria-label="BarContainerSecondRowMainContainer">
                    <Grid item xs={props.barLineBefore ? 1 : "auto"} role="gridcell" aria-label="BarContainerSecondRowBarLineBefore"></Grid>
                    <Grid item xs={10} role="gridcell" aria-label="BarContainerSecondRowMenuButton">
                        <Box display="flex" flexGrow={1}>
                            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} role="button" aria-label="BarContainerSecondRowButton">
                                <MoreHorizIcon style={{ marginLeft: "0px" }} />
                            </Button>
                            <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} role="menu">
                                <MenuItem onClick={handleClose}>Slett takt </MenuItem>
                                <MenuItem onClick={handleClose}>Dupliser takt </MenuItem>
                            </Menu>
                        </Box>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </Grid>
        </Grid>

    );
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
