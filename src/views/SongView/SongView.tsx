import React, { useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import SongContextProvider, { SongContext } from "./SongContextProvider.component";
import { Grid, makeStyles, Box, useMediaQuery, Button, } from '@material-ui/core';
import { TimeSignature, BarNumber } from '../../components/SongViewComponents/SongView.component';
import { BarContainer } from "../../components/BarContainer/BarContainer.component";


export type SongViewProps = {
}

export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();
  const xs = useMediaQuery("(max-width: 600px)");
  const xl = useMediaQuery("(min-width: 1920px)");
  const history = useHistory();
  const queryString = require('query-string');
  const { song: { voices } } = useContext(SongContext);

  //Find SongID from URL
  const params: { id: string } = useParams();
  const id = params.id;

  const voiceString = queryString.parse(window.location.search);
  let selectedVoice = 0;
  if (voiceString.voice !== undefined) {
    const voiceInt = parseInt(voiceString.voice);
    if (voiceInt > voices.length || voiceInt <= 0) {
      history.push(`/song/${1}?voice=1`);
    } else {
      selectedVoice = voiceString.voice - 1;
    }
  } else {
    history.push(`/song/${1}?voice=1`);
  }

  useEffect(() => {
    const item = localStorage.getItem("timeSignature");
    if (item !== '["2","4"]' && item !== '["3","4"]' && item !== '["4","4"]' && item !== '["6","8"]') {
      history.push({ pathname: "/dashboard" })
    }
  }, [history]);

  const addEmptyBar = () => {
    //setBars([...bars, { bars: [] }])
  }

  const isBarLineBefore = (index: number) => {
    return xl && index % 4 === 0 ? true : !xs && !xl && index % 2 === 0 ? true : xs ? true : false
  }

  const isBarLineAfter = (index: number) => {
    return index === voices[selectedVoice].bars.length - 1 ? true : false;
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} >
        <NavBarCreateSong />
      </Grid>
      <Grid item xs={12}>
        <CreateSongTab />
      </Grid>
      <Grid item xs={12}> {/*Grid for main container, containing the bars, timeSignature and barnumber */}
        <Grid container>

          <Grid item xs={1}>
            {voices[selectedVoice].bars.map((bar, i) => {
              if (i === 0) { return (<TimeSignature key={i} />) }
              else if (xl && i % 4 === 0) { return (<BarNumber key={i} barNumber={i + 1} />) }
              else if (!xs && !xl && i % 2 === 0) { return (<BarNumber key={i} barNumber={i + 1} />) }
              else if (xs) { return (<BarNumber key={i} barNumber={i + 1} />) }
              return <div key={i} ></div>
            })}
          </Grid>

          <Grid item xs={10}>
            <Grid container>
              {voices[selectedVoice].bars.map((bar, i) => (
                <Grid item xs={12} sm={6} xl={3} key={i} >
                  <BarContainer barLineBefore={isBarLineBefore(i)} barLineAfter={isBarLineAfter(i)} house={bar.house} repBefore={bar.repBefore} repAfter={bar.repAfter} chordsAndTones={bar.chordsAndTones} barNumber={i} />
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