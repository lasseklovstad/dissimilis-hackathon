import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/dashboardButtons/dashboardButtons';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import testData from './DashboardTestData';
import { Card } from '@material-ui/core'
//
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

/*This text is for the language-based text*/
import staticText from '../../assets/languages/norwegian/dasboard';



export default function DashboardView() {
  const style = useStyles();
  return (
    <div>
        <AppBar position="static"><Toolbar style={{color: "inherit"}}>En toolbar som dette tilhører subtask diss100</Toolbar></AppBar>
      
        <Box mt={8}>
          <Grid container justify="center">
            <Grid item sm={10}>
              <Box m={2}>
                <Typography variant="h1">{staticText.newSongLabel}</Typography>
              </Box>
              <Grid container spacing={3}>
              {testData.newSongButtons.map(songs => (
                  <Grid item sm={4} lg={2}>
                    <DashboardButtonWithAddIcon text={songs.text} link={songs.link} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>


        <Box mt={3}>
          <Grid container justify="center">
            <Grid item sm={10}>
              <Box m={2}>
                <Typography variant="h1">{staticText.recentLabel}</Typography>
              </Box>
              <Grid container spacing={3}>
              {testData.recentSongButtons.map(songs => (
                  <Grid item sm={4} lg={2}>
                    <DashboardButton text={songs.text} link={songs.link} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box my={6}>
          <Grid container>
            <Grid item sm={1} />
            <Grid item sm={2}>
                <DashboardLibraryButton text={staticText.libraryButton} link={"/library"} />
            </Grid>
          </Grid>
        </Box>
    </div>
  );
}

const useStyles = makeStyles({
  
  
});
