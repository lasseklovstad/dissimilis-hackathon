import React from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import RepetitionSign from "./RepetitionSign.component";
import House from "./House.component";
import { BarBody } from "./BarBody.component";
import { IChordAndNotes } from "../../models/IBar";


export type BarProps = {
    repBefore: boolean,
    repAfter: boolean,
    house?: number,
    chordsAndNotes: IChordAndNotes[],
    barLineAfter?: boolean,
    height?: number,
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
            <Grid container role="grid" style={{ height: "100%" }}>
                <Grid item xs={12} role="gridcell" style={{ height: "100%" }}>
                    <Grid container className={classes.firstRow} role="grid">
                        <Grid item xs={1} role="gridcell"></Grid>
                        <Grid item xs={9} role="gridcell" aria-label={props.house + ". ending"}>
                            <House houseOrder={props.house} />
                        </Grid>
                        <Grid item xs={1} role="gridcell" ></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.secondRow} role="gridcell" >
                    <Grid container spacing={0} style={{ height: "100%" }} role="grid" >
                        <Grid item xs={props.repBefore ? 1 : "auto"} role="gridcell" aria-label="repetition sign before the tone">
                            <Box mt={"20px"}>
                                <RepetitionSign size="small" display={props.repBefore} />
                            </Box>
                        </Grid>
                        <Grid item xs={centerDivSize} role="gridcell" aria-label={"Bar"}>
                            <BarBody height={props.height} chordsAndNotes={props.chordsAndNotes} />
                        </Grid>
                        <Grid item xs={1} style={{ borderRight: props.barLineAfter ? "6px double black" : "2px solid black" }} role="gridcell" aria-label="repetition sign after the tone" >
                            <Box mt={"20px"}>
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
    },
    secondRow: {
    }
})

export default Bar;
