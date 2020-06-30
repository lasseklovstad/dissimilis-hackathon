import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DashboardButtonWithAddIcon, DashboardButton } from '../../components/dashboardButtons/dashboardButtons';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import testData from './DashboardTestData';

/*This text is for the language-based text*/
import staticText from '../../assets/languages/norwegian/dasboard';



export default function DashboardView() {
  const style = useStyles();
  return (
    <div className={style.background}>
      <ThemeProvider theme={theme}>
        <div className={style.topComponent}></div>
        
        <div className={style.newSongContainer}>
          <Typography variant="h1">{staticText.newSongLabel}</Typography>
          <Grid container spacing={2}>
          {testData.newSongButtons.map(songs => (
              <Grid item xs={4} md={3} lg={2}>
                <DashboardButtonWithAddIcon text={songs.text} />
              </Grid>
            ))}
          </Grid>
        </div>
        <div className={style.recentSongsContainer}>
          <Typography variant="h1">{staticText.recentLabel}</Typography>
          <Grid container spacing={2}>
          {testData.recentSongButtons.map(songs => (
              <Grid item xs={4} md={3} lg={2}>
                <DashboardButton text={songs.text} />
              </Grid>
            ))}
          </Grid>
        </div>
      </ThemeProvider>
    </div>
  );
}

const useStyles = makeStyles({
  background: {
    backgroundColor : "#F5F5F5",
    height: "100vh",
    width: "100vw"
  },
  topComponent: {
    width: "100%",
    height: "20vh"
  },
  newSongContainer: {
    height: "20%",
    width: "100%"
  },
  recentSongsContainer: {
    height: "20%",
    width: "100%"
  }
});

const theme = createMuiTheme({      
  typography: {
    h1: {
      fontSize: '20px'
    }
  }
});
