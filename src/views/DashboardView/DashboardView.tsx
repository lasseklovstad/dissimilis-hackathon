import React, { useState } from 'react';
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/DashboardButtons/DashboardButtons';
import Grid from '@material-ui/core/Grid';
import { Typography, Box } from '@material-ui/core';
import testData from './DashboardTestData';
import DashboardTopBar from '../../components/DashboardTopBar/DashboardTopBar'
import {useTranslation} from "react-i18next";




export default function DashboardView() {
  const {t, i18n} = useTranslation();
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
      <Grid container justify="center" spacing={10} >
        
        <Grid item xs={12}>
          <DashboardTopBar />
        </Grid>

        <Grid item xs={12} sm={10} key="newSongContainer">
          
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:newSongLabel")}</Typography>
            </Box>
            <Grid container spacing={3}>
              {musicTacts.map(songs => (
                <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                  <DashboardButtonWithAddIcon text={songs.text} link={songs.link} />
                </Grid>
              ))}
            </Grid>
          
        </Grid>

        <Grid item xs={12} sm={10} key="recentSongsContainer">
          <Box m={2}>
            <Typography variant="h1">{t("DashboardView:recentLabel")}</Typography>
          </Box>
          <Grid container spacing={3}>
            {recentSongs.recentSongButtons.map(songs => (
              <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                <DashboardButton text={songs.text} link={songs.link} />
                </Grid>
            ))}
            <Grid item xs={12} sm={4} lg={3} key="library">
              <DashboardLibraryButton text={t("DashboardView:libraryButton")} link={"/library"} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
