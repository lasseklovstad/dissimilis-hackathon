import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import Bar from '../../components/Bar/Bar.component';

export type CommonViewProps = {

}

export const CommonView: React.FC<CommonViewProps> = props => {
    const classes = useStyles();
    return (
        <div>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Typography variant="h1">Bar-komponent:</Typography>
                </Grid>
                <Grid item xs={12} style={{ border: "1px dotted black" }}>
                    <Typography variant="subtitle1">Dette er taktkomponenten (uten toner foreløpig) der man har mulighet for å vise repetisjonshus, repetisjonstegn foran og repetisjonstegn bak. Rammen rundt er kun for illustrasjon.  </Typography>

                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar house={true} repBefore={true} repAfter={true} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar house={true} repBefore={false} repAfter={true} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar house={false} repBefore={false} repAfter={false} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar house={true} repBefore={false} repAfter={false} />
                </Grid>
            </Grid>
        </div >
    )
}

const useStyles = makeStyles({
    root: {
        margin: "auto",
        width: "60%",
        textAlign: "center",
    }
})

export default CommonView;
