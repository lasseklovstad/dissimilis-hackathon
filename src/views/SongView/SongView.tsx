import React, { useState } from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles, Box, useMediaQuery, Button, } from '@material-ui/core';
import SongViewBarComponent, { SongViewMeasureComponent, SongViewBarNumberComponent } from '../../components/SongViewComponents/SongView.component';

export type SongViewProps = {

}
export interface ILeftGridComponent {
  type: "measure" | number
}
export interface IBar {
  bars: string[]
  //Put additional information here, this is just a start
}

export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();
  const xs = useMediaQuery("(max-width: 600px)");
  const xl = useMediaQuery("(min-width: 1920px)");

  const [bars, setBars] = useState<IBar[]>([{ bars: [] }])
  const [leftGrid, setLeftGrid] = useState<ILeftGridComponent[]>([{ type: "measure" }])

  const addEmptyBar = () => {
    if (xs) {
      if (bars.length === leftGrid.length) {
        setLeftGrid([...leftGrid, { type: bars.length + 1 }])
      }
      setBars([...bars, { bars: [] }])
    } else if (xl) {
      if ((bars.length % 4 === 0)) {
        setLeftGrid([...leftGrid, { type: bars.length + 1 }])
      }
      setBars([...bars, { bars: [] }])
    } else {
      if ((bars.length % 2 === 0)) {
        setLeftGrid([...leftGrid, { type: bars.length + 1 }])
      }
      setBars([...bars, { bars: [] }])
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


      <Grid item xs={12}> {/*Grid for main container, containing the bars, measure and barnumber */}
        <Grid container>

          <Grid item xs={1}>
            {leftGrid.map(object => (
              object.type === "measure" ? (<SongViewMeasureComponent />) : (<SongViewBarNumberComponent barNumber={object.type} />)
            ))}
          </Grid>

          <Grid item xs={10}>
            <Grid container>
              {bars.map(bar => (
                <Grid item xs={12} sm={6} xl={3} >
                  <SongViewBarComponent />
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