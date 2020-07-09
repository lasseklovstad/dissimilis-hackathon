import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";

export type HouseProps = {
    houseOrder: number | undefined,
}

export const House: React.FC<HouseProps> = props => {
    return (
        <Box mb={1}>
            {props.houseOrder === undefined ? null :
                <Grid container>
                    <Grid item xs={1} ></Grid>
                    <Grid item xs={11} style={{ textAlign: "left", borderBottom: "2px solid black" }}>
                        <Typography variant="body1">{props.houseOrder + "."}</Typography>
                    </Grid>
                </Grid>}
        </Box>
    )
}

export default House;
