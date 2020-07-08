import React, { useState } from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles, Box, useMediaQuery, Button, } from '@material-ui/core';
import SongViewBarComponent, { SongViewMeasureComponent, SongViewBarNumberComponent } from '../../components/SongViewComponents/SongView.component';

export type SongViewProps = {

}

export const SongView: React.FC<SongViewProps> = props => {
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
    <Grid container className={classes.root}>
      <Grid item xs={12} >
        <NavBarCreateSong />
      </Grid>
      <Grid item xs={12}>
        <Box mb={4}>
          <CreateSongTab />
        </Box>
      </Grid>
      
      <Grid item xs={1}>
        {leftGrid.map(element => (
          element
        ))}
      </Grid>

      <Grid item xs={10}> {/*Grid for main container, containing the bars, measure and barnumber */}
        <Grid container>
          {bars.map(element => (
            <Grid item xs={12} sm={6} xl={3} >
              {element}
            </Grid>
          ))}
        </Grid>
      </Grid>


      <Box mb={4}>
        <Button variant="outlined" color="primary" onClick={() => addEmptyBar()}>
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