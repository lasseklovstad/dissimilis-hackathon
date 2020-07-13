import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles, Box, useMediaQuery, Button, } from '@material-ui/core';
import { TimeSignature, BarNumber, Bar } from '../../components/SongViewComponents/SongView.component';

export type SongViewProps = {

}

export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();
  const xs = useMediaQuery("(max-width: 600px)");
  const xl = useMediaQuery("(min-width: 1920px)");

  const [bars, setBars] = useState([{ bars: [] }])

  const history = useHistory();

  useEffect(() => {
    const item = localStorage.getItem("timeSignature");
    if (item !== '["2","4"]' && item !== '["3","4"]' && item !== '["4","4"]' && item !== '["6","8"]') {
      history.push({ pathname: "/dashboard" })
    }
  }, [history]);

  const addEmptyBar = () => {
    setBars([...bars, { bars: [] }])
  }

  return (
    <Grid container className={classes.root}>

      <Grid item xs={12}>
        <NavBarCreateSong />
      </Grid>
      <Grid item xs={12}>
        <Box mb={4}>
          <CreateSongTab />
        </Box>
      </Grid>

      <Grid item xs={12}> {/*Grid for main container, containing the bars, timeSignature and barnumber */}
        <Grid container>

          <Grid item xs={1}>
            {bars.map((bar, i) => {
              if (i === 0) { return (<TimeSignature />) }
              else if (xl && i % 4 === 0) { return (<BarNumber barNumber={i + 1} />) }
              else if (!xs && !xl && i % 2 === 0) { return (<BarNumber barNumber={i + 1} />) }
              else if (xs) { return (<BarNumber barNumber={i + 1} />) }
              return <></>
            })}
          </Grid>

          <Grid item xs={10}>
            <Grid container>
              {bars.map(bar => (
                <Grid item xs={12} sm={6} xl={3} >
                  <Bar />
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Grid>

      <Box mb={4}>
        <Button variant="outlined" color="primary" onClick={addEmptyBar}>
          Legg til takt
        </Button>
      </Box>

    </Grid>
  );
}

const useStyles = makeStyles({
  root: {
    marginLeft: "24px",
    marginTop: "32px",
    marginRight: "32px",
    width: "auto"
  }
})

export default SongView;