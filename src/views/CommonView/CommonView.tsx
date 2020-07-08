import React, { useState } from 'react';
import { Typography, Grid, makeStyles, Box, useMediaQuery, Button } from '@material-ui/core';
import Bar from '../../components/Bar/Bar.component';
import SongViewBarComponent, { SongViewBarNumberComponent, SongViewMeasureComponent } from '../../components/SongViewComponents/SongView.component';

export type CommonViewProps = {

}

export const CommonView: React.FC<CommonViewProps> = props => {
    const classes = useStyles();
    const xs = useMediaQuery("(max-width: 600px)");
    const xl = useMediaQuery("(min-width: 1920px)");

    const [bars, setBars] = useState([(<SongViewBarComponent />)])
    const [leftGrid, setLeftGrid] = useState([(<SongViewMeasureComponent />)])

    const addEmptyBar = () => {
        if (xs) {
            if (bars.length === leftGrid.length) {
                setLeftGrid([...leftGrid, (<SongViewBarNumberComponent />)])
            }
            setBars([...bars, (<SongViewBarComponent />)])
        } else if (xl) {
            if ((bars.length % 4 === 0)) {
                setLeftGrid([...leftGrid, (<SongViewBarNumberComponent />)])
            }
            setBars([...bars, (<SongViewBarComponent />)])
        } else {
            if ((bars.length % 2 === 0)) {
                setLeftGrid([...leftGrid, (<SongViewBarNumberComponent />)])
            }
            setBars([...bars, (<SongViewBarComponent />)])
        }
    }





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

            <Box mt={4}>

                <Grid container className={classes.root}>
                    <Grid item xs={12}>
                        <Box mx={4}>
                            <Typography variant="h1">Gridlogikk</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}> {/*Grid for main container, containing the bars, measure and barnumber */}
                        <Grid container>
                            <Grid item xs={1}>
                                {leftGrid.map(element => (
                                    element
                                ))}
                            </Grid>

                            <Grid item xs={10}>
                                <Grid container>
                                    {bars.map(element => (
                                        <Grid item xs={12} sm={6} xl={3} >
                                            {element}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box mb={4}>
                                <Button variant="outlined" color="primary" onClick={() => addEmptyBar()}>
                                    Legg til takt
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
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
