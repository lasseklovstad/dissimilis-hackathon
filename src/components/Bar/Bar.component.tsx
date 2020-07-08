import React from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { Divider } from '@material-ui/core';
import colors from "../../utils/colors";
import RepetitionSign from "./RepetitionSign.component";

export type BarProps = {
    house: boolean,
    repBefore: boolean,
    repAfter: boolean,
}



export const Bar: React.FC<BarProps> = props => {
    const classes = useStyles();
    let centerDivSize: 9 | 10 | 11 = 9;
    if (!props.repBefore && !props.repAfter) {
        centerDivSize = 11;
    } else if (props.repBefore && props.repAfter) {
        centerDivSize = 9;
    } else {
        centerDivSize = 10;
    }

    return (
        <Box className={classes.root} mx="auto" mt={8}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid container className={classes.firstRow}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={9}>
                            <Box mt={0}>
                                <Divider variant="middle" className={classes.house} style={{ display: props.house ? "block" : "none" }} />
                            </Box>
                        </Grid>
                        <Grid item xs={1}></Grid>
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
                        </Grid>
                        <Grid item xs={props.repAfter ? 1 : "auto"}>
                            <Box mt={"20px"} className={classes.repSignHolder}>
                                <RepetitionSign size="small" display={props.repAfter} />
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider orientation="vertical" variant="middle" className={classes.barline} />
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
        height: "16px",
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
