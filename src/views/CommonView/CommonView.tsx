import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import Bar from '../../components/Bar/Bar.component';
import BarContainer from '../../components/BarContainer/BarContainer.component';
import Block from '../../components/Bar/Block.component';

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
                    <Bar barNumber={1} notes={[["C", "A", "F"]]} repBefore={true} repAfter={true} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar barNumber={2} notes={[["C", "A", "F"]]} repBefore={false} repAfter={true} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar barNumber={3} notes={[["C", "A", "F"]]} repBefore={true} repAfter={false} />
                </Grid>
                <Grid item xs={12} sm={6} style={{ border: "1px dotted black" }}>
                    <Bar barNumber={4} notes={[["C", "A", "F"]]} repBefore={false} repAfter={false} />
                </Grid>
                <Grid item xs={12} style={{ height: "200px" }}>
                    <hr />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h1">BarContainer-komponent:</Typography>
                </Grid>
                <Grid item xs={12} style={{ border: "1px dotted black" }}>
                    <Typography variant="subtitle1">Dette er containeren som wrapper rundt takten. Denne har en knapp til hver takt, og gjør det mulig å legge til taktstrek foran (for takter som begynner på ny linje) og taktstrek bak for å få dobbel taktstrek  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} >
                    <BarContainer barNumber={1} notes={[["C", "A", "F"]]} barLineBefore={true} barLineAfter={false} repAfter={false} repBefore={true} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarContainer barNumber={2} notes={[["C", "H"]]} barLineBefore={true} barLineAfter={false} repAfter={false} repBefore={false} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarContainer barNumber={3} notes={[["A", "H", "F"]]} barLineBefore={true} barLineAfter={false} house={1} repAfter={false} repBefore={false} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarContainer barNumber={4} notes={[["A", "D", "F"]]} barLineBefore={true} barLineAfter={false} house={2} repAfter={true} repBefore={false} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarContainer barNumber={5} notes={[["A"], ["C"]]} barLineBefore={true} barLineAfter={false} repAfter={false} repBefore={false} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <BarContainer barNumber={6} notes={[["A", "D"], ["C", "D"], ["A", "D"], ["A", "B"]]} barLineBefore={true} barLineAfter={true} repAfter={false} repBefore={false} />
                </Grid>
                <Grid item xs={12} style={{ height: "200px" }}>
                    <hr />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h1">BarContainer-komponent:</Typography>
                </Grid>
                <Grid item xs={12} style={{ height: "300px" }}>
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
        "@media (max-width: 600px)": {
            width: "90%",
        },
        height: "auto",
    }
})

export default CommonView;
