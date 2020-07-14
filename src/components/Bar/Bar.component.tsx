import React, { useContext } from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import RepetitionSign from "./RepetitionSign.component";
import House from "./House.component";
import { BarBody } from "./BarBody.component";
import { IChordAndTones } from "../../models/IBar";


export type BarProps = {
    barID: string,
    repBefore: boolean,
    repAfter: boolean,
    house?: number,
    chordsAndTones: IChordAndTones[],
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
            <Grid container role="grid">
                <Grid item xs={12} role="gridcell">
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
                        <Grid item xs={centerDivSize} role="gridcell" aria-label={"Bar " + props.barID}>
                            <BarBody chordsAndTones={props.chordsAndTones} />
                        </Grid>
                        <Grid item xs={1} style={{ borderRight: "2px solid black" }} role="gridcell" aria-label="repetition sign after the tone" >
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
        height: "32px",
    },
    secondRow: {
        height: "120px",
    }
})

export default Bar;
