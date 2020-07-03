import React, { useState } from 'react';
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/DashboardButtons/DashboardButtons';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import testData from './DashboardTestData';
import DashboardTopBar from '../../components/DashboardTopBar/DashboardTopBar'

import staticText from '../../assets/languages/norwegian/dashboard';

export default function DashboardView() {
  const [recentSongs, setRecentSongs] = useState(testData);
  return (
    <div>
        <DashboardTopBar />
      
        <Box mt={6}>
          <Grid container justify="center">
            <Grid item sm={10} key="centerContainer">
              <Box m={2}>
                <Typography variant="h1">{staticText.newSongLabel}</Typography>
              </Box>
              <Grid container spacing={3}>
                {staticText.newSongButtons.map(songs => (
                  <Grid item sm={4} lg={2} key={songs.id}>
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
                {recentSongs.recentSongButtons.map(songs => (
                  <Grid item sm={4} lg={2} key={songs.id}>
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
