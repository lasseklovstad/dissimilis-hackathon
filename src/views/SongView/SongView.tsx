import React, { useEffect, useContext, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { SongContext } from "./SongContextProvider.component";
import { Grid, makeStyles, useMediaQuery } from '@material-ui/core';
import { TimeSignature, BarNumber } from '../../components/SongViewComponents/SongView.component';
import { BarContainer } from "../../components/BarContainer/BarContainer.component";
import BottomBar from '../../components/BottomBar/BottomBar.component';


export type SongViewProps = {
}

export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();
  const xs = useMediaQuery("(max-width: 600px)");
  const xl = useMediaQuery("(min-width: 1920px)");
  const history = useHistory();
  const queryString = require('query-string');
  const { song: { voices } } = useContext(SongContext);


  const voiceString = queryString.parse(window.location.search);
  let selectedVoice = 0;
  if (voiceString.voice !== undefined) {
    const voiceInt = parseInt(voiceString.voice);
    if (voiceInt > voices.length || voiceInt <= 0) {
      history.replace(`/song/${1}?voice=1`);
    } else {
      selectedVoice = voiceString.voice - 1;
    }
  } else {
    history.replace(`/song/${1}?voice=1`);
  }

  useEffect(() => {
    const item = localStorage.getItem("timeSignature");
    if (item !== '["2","4"]' && item !== '["3","4"]' && item !== '["4","4"]' && item !== '["6","8"]') {
      history.push({ pathname: "/dashboard" })
    }
  }, [history]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [voices])


  const isBarLineBefore = (index: number) => {
    return xl && index % 4 === 0 ? true : !xs && !xl && index % 2 === 0 ? true : xs ? true : false
  }

  const isBarLineAfter = (index: number) => {
    return index === voices[selectedVoice].bars.length - 1 ? true : false;
  }

  return (
    <>
      <Grid container className={classes.root} >
        <Grid item xs={12} >
          <NavBarCreateSong />
        </Grid>
        <Grid item xs={12}>
          <CreateSongTab />
        </Grid>
        <Grid item xs={12} className={classes.songViewContainer}> {/*Grid for main container, containing the bars, timeSignature and barnumber */}
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
                    <BarContainer voiceId={selectedVoice} masterSheet={selectedVoice === 0} barNumber={i} bar={bar} barLineBefore={isBarLineBefore(i)} barLineAfter={isBarLineAfter(i)} />
                  </Grid>
                ))}
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
      <BottomBar />

    </>

  );
}

const useStyles = makeStyles({
  root: {
    marginLeft: "16px",
    marginTop: "32px",
    marginRight: "16px",
    marginBottom: "120px",
    '@media (max-width: 1080px)': {
      marginBottom: "160px",
    },
    width: "auto",
  },
  songViewContainer: {
    marginTop: "24px"
  }
})

export default SongView;