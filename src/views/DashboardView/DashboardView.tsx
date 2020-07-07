import React, { useState } from 'react';
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/DashboardButtons/DashboardButtons';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import testData from './DashboardTestData';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useTranslation } from "react-i18next";
import { writeStorage } from '@rehooks/local-storage';



export default function DashboardView() {
  const { t, i18n } = useTranslation();
  const [recentSongs, setRecentSongs] = useState(testData);
  const addedToText = t("DashboardView:measure");
  const musicTacts = [
    {
      id: 1,
      text: "2/4-" + addedToText,
      link: "/"
    },
    {
      id: 2,
      text: "3/4-" + addedToText,
      link: "/"
    },
    {
      id: "3",
      text: "4/4-" + addedToText,
      link: "/"
    },
    {
      id: 4,
      text: "6/8-" + addedToText,
      link: ""
    }
  ];


  return (
    <div>
      <AppBar position="static"><Toolbar style={{ color: "inherit" }}>En toolbar som dette tilhører subtask diss100</Toolbar></AppBar>

      <Box mt={8}>
        <Grid container justify="center">
          <Grid item sm={10} key="centerContainer">
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:newSongLabel")}</Typography>
            </Box>
            <Grid container spacing={3}>
              {musicTacts.map(songs => (
                <Grid item sm={4} lg={2} key={songs.id}>
                  <DashboardButtonWithAddIcon func={() => writeStorage("measure", songs.text.match(/[0-9]+/g))} text={songs.text} link={"/song"} />
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
              <Typography variant="h1">{t("DashboardView:recentLabel")}</Typography>
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
            <DashboardLibraryButton text={t("DashboardView:libraryButton")} link={"/library"} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
