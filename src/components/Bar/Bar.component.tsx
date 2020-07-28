import React from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import RepetitionSign from "./RepetitionSign.component";
import House from "./House.component";
import { BarBody } from "./BarBody.component";
import { IChordAndNotes } from "../../models/IBar";


export type BarProps = {
    barNumber: number,
    repBefore: boolean,
    repAfter: boolean,
    house?: number,
    chordsAndNotes: IChordAndNotes[],
    barLineAfter?: boolean,
    height?: number,
    voiceId: number,
    exportMode?: boolean,
    rowsPerSheet?: number,
}



export const Bar: React.FC<BarProps> = props => {
    const classes = useStyles();
    let centerDivSize: 9 | 10 | 11 = 9;

    if ((props.repBefore && props.repAfter) || (props.repBefore && !props.repAfter)) {
        centerDivSize = 10;
    } else if ((!props.repBefore && props.repAfter) || (!props.repBefore && !props.repAfter)) {
        centerDivSize = 11;
    } else {
        centerDivSize = 9;
    }


    return (
        <Box className={classes.root} mx="auto" role="main">
            <Grid container role="grid" className={classes.fullHeight}>
                <Grid item xs={12} role="gridcell" className={classes.fullHeight}>
                    <Grid container className={classes.firstRow} role="grid">
                        <Grid item xs={1} role="gridcell">
                        </Grid>
                        <Grid item xs={9} role="gridcell" aria-label={props.house + ". ending"}>
                            <House houseOrder={props.house} />
                        </Grid>
                        <Grid item xs={1} role="gridcell" ></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ height: props.height }} role="gridcell" >
                    <Grid container spacing={0} className={classes.fullHeight} role="grid" >
                        <Grid item xs={props.repBefore ? 1 : "auto"} role="gridcell" aria-label="repetition sign before the tone">
                            <Box mt={((props.height || 120) - 56) / 2 + "px"}>
                                <RepetitionSign size="small" display={props.repBefore} />
                            </Box>
                        </Grid>
                        <Grid item xs={centerDivSize} role="gridcell" aria-label={"Bar"}>
                            <BarBody exportMode={props.exportMode} rowsPerSheet={props.rowsPerSheet} voiceId={props.voiceId} barNumber={props.barNumber} height={props.height} chordsAndNotes={props.chordsAndNotes} />
                        </Grid>
                        <Grid item xs={1} style={{ borderRight: props.barLineAfter ? "6px double black" : "2px solid black" }} role="gridcell" aria-label="repetition sign after the tone" >
                            <Box mt={((props.height || 120) - 56) / 2 + "px"}>
                                <RepetitionSign size="small" display={props.repAfter} />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


        </Box>
    )


}

const useStyles = makeStyles({
    root: {
        width: "100%",
        padding: "8px",
    },
    firstRow: {
        height: "32px"
    },
    fullHeight: {
        height: "100%",
    }

})

export default Bar;
