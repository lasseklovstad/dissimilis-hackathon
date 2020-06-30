import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DashboardButtonWithAddIcon } from '../../components/dashboardButtons/dashboardButtons';
import Grid from '@material-ui/core/Grid';
import testData from './DashboardTestData';

let statictext = require('../../assets/languages/norwegian/dasboard.json');

const useStyles = makeStyles({
  background: {
    backgroundColor : "#F5F5F5",
    height: "100vh",
    width: "100vw"
  },
  topComponent: {
    width: "100vw",
    height: "20vh"
  },
  newSongContainer: {
    height: "30vh",
    width: "100vw"
  }
});

export default function DashboardView() {
  const style = useStyles();
  return (
    <div className={style.background}>
      <div className={style.topComponent}></div>
      
      <div className={style.newSongContainer}>
        <Grid container spacing={3}>
        {testData.newSongButtons.map(songs => (
            <Grid>
              <DashboardButtonWithAddIcon text={songs.text} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
