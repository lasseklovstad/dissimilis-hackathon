import React from "react";
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import colors from "../../utils/colors";
import RepetitionSign from "./RepetitionSign.component";
import Note from "./Note.component";

export type BarProps = {
    house?: number,
    repBefore: boolean,
    repAfter: boolean,
    notes: string[],
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
        <Box className={classes.root} mx="auto">
            <Grid container>
                <Grid item xs={12}>
                    <Grid container className={classes.firstRow}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={9}>
                            <Box mb={1}>
                                <Grid container >
                                    <Grid item xs={1}></Grid>
                                    <Grid item xs={11} style={{ textAlign: "left", borderBottom: props.house !== undefined ? "2px solid black" : 0 }}>
                                        <Typography variant="body1">{props.house !== undefined ? props.house + "." : ""}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.secondRow}>
                    <Grid container spacing={0} style={{ height: "100%" }}>
                        <Grid item xs={props.repBefore ? 1 : "auto"} >
                            <Box mt={"20px"}>
                                <RepetitionSign size="small" display={props.repBefore} />
                            </Box>
                        </Grid>
                        <Grid item xs={centerDivSize}>
                            <Note color={"blue"} size={1} notes={props.notes} />
                        </Grid>
                        <Grid item xs={1} style={{ borderRight: "2px solid black" }}>
                            <Box mt={"20px"} className={classes.repSignHolder}>
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
    },
    house: {
        backgroundColor: colors.black,
        height: "2px",
    },
    barline: {
        backgroundColor: colors.black,
        width: "2px",
        borderRight: 0,
        borderLeft: 0,
    },
    repSignHolder: {

    }
})

export default Bar;
