import React, { FC } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { ReactComponent as BackgroundImage } from '../../assets/images/butterflyGreen.svg';

export type TryLoginViewProps = {

}

export const TryLoginView: FC<TryLoginViewProps> = props => {


    return (
        <Grid container >
            <Typography variant="h2">Test</Typography>
        </Grid>
    );
}