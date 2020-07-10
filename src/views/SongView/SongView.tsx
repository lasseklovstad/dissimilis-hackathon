import React, { useState } from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles, Box, useMediaQuery, Button, } from '@material-ui/core';
import SongViewBarComponent, { SongViewTimeSignatureComponent, SongViewBarNumberComponent } from '../../components/SongViewComponents/SongView.component';

export type SongViewProps = {

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
              if(i===0){return (<SongViewTimeSignatureComponent />)}
              else if(xl && i%4===0){return (<SongViewBarNumberComponent barNumber={i+1} />)}
              else if(!xs && !xl && i%2===0){return (<SongViewBarNumberComponent barNumber={i+1} />)}
              else if(xs){return (<SongViewBarNumberComponent barNumber={i+1} />)}
              return <></>
            })}
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