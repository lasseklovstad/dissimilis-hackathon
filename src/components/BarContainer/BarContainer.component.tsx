import React, { useContext } from "react";
import { makeStyles, Grid, Box, Button, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import Bar from "../Bar/Bar.component";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { IBar } from "../../models/IBar"


export type BarContainerProps = {
    barLineBefore: boolean,
    barLineAfter: boolean,
    bar: IBar,
    masterSheet: boolean,
    height?: number,
};

export const BarContainer: React.FC<BarContainerProps> = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const { deleteBar, duplicateBar, song: { voices } } = useContext(SongContext);
    const bar = props.bar

    const queryString = require('query-string');
    const voiceStringFromURL = queryString.parse(window.location.search);
    const voiceId: number = parseInt(voiceStringFromURL.voice);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (method: string) => {
        const index = voices[0].bars.indexOf(bar);
        if (method === "delete") {
            deleteBar(index, voiceId - 1);
        }
        if (method === "duplicate") {
            duplicateBar(index, voiceId - 1);
        }
        setAnchorEl(null);
    };

    if (bar === undefined) {
        return <></>
    } else {
        let centerDivSize: 10 | 11 | 12 = 11;

        return (
            <Grid container role="grid" className={classes.fullHeight}>
                <Grid item xs={12} role="row">
                    <Grid container style={{ height: "auto" }} role="grid" aria-label="barline before the bar">
                        <Grid item xs={props.barLineBefore ? 1 : "auto"} className={classes.barlineBox} style={{ height: !props.height ? "120px" : props.height, borderRight: props.barLineBefore ? "2px solid black" : "0" }} role="gridcell">
                        </Grid>
                        <Grid item xs={centerDivSize} role="gridcell" aria-label="the bar">
                            <Bar height={props.height || 120} repBefore={bar.repBefore} repAfter={bar.repAfter} house={bar.house} chordsAndNotes={bar.chordsAndNotes} barLineAfter={props.barLineAfter} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} role="row" style={{ height: "32px" }}>
                    <Grid container role="grid" >
                        <Grid item xs={props.barLineBefore ? 1 : "auto"} role="gridcell" ></Grid>
                        <Grid item xs={10} role="gridcell" style={{ display: props.masterSheet ? "block" : "none" }}>
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
    barline: {
        backgroundColor: colors.black,
        width: "2px",
        borderRight: 0,
        borderLeft: 0,
    },
    barlineBox: {
        marginTop: "40px",
    },
    fullHeight: {
        height: "100%",
    }

});

export default BarContainer;
