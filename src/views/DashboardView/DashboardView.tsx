import React, { useState } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from "react-i18next";
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/DashboardButtons/DashboardButtons';
import DashboardTopBar from '../../components/DashboardTopBar/DashboardTopBar'
import { writeStorage } from '@rehooks/local-storage';
import { useApiService } from '../../utils/useApiService';
import { ISong } from '../../models/ISong';
import { useGetRecentSongs } from '../../utils/useGetRecentSongs';

export type DashboardViewProps = {

}

export default function DashboardView() {
  const { t } = useTranslation();
  let url = "Song/songs";
  let params = { "Num": "5", "ArrangerId": "1", "OrderByDateTime": "true" }
  const measureText = t("DashboardView:measure");
  //Burde jeg her bare stole på at databsen kun har hentet fem objekter?
  const dataFromApi = useGetRecentSongs()
  const recentSongs = dataFromApi ? dataFromApi.slice(0, 5) : [];
  const musicTacts = [
    {
      id: 1,
      text: "2/4-" + measureText,
      link: "/"
    },
    {
      id: 2,
      text: "3/4-" + measureText,
      link: "/"
    },
    {
      id: "3",
      text: "4/4-" + measureText,
      link: "/"
    },
    {
      id: 4,
      text: "6/8-" + measureText,
      link: ""
    }
  ];
  const styles = useStyles()
  const marginBottom = 4;

  const storeMeasureToLocalStorage = (data: string) => {
    const regex = /[0-9]+/g;
    const newData = data.match(regex);
    writeStorage("measure", newData)
  }

  return (
    <Box mx={2}>
      <Grid container justify="center" className={styles.container}>

        <Grid item xs={12}>
          <Box mb={marginBottom}>
            <DashboardTopBar />
          </Box>
        </Grid>

        <Grid item xs={12} sm={10} key="newSongContainer">
          <Box mb={marginBottom}>
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:newSongLabel")}</Typography>
            </Box>
            <Grid container spacing={3}>
              {musicTacts.map(songs => (
                <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                  <DashboardButtonWithAddIcon func={() => storeMeasureToLocalStorage(songs.text)} text={songs.text} link={songs.link} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} sm={10} key="recentSongsContainer">
          <Box mb={marginBottom}>
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:recentLabel")}</Typography>
            </Box>
            <Grid container spacing={3}>
              {recentSongs.map(song => (
                <Grid item xs={12} sm={4} lg={3} key={song.id}>
                  <DashboardButton text={song.title} link={`/song/${song.id}`} />
                </Grid>
              ))}
              <Grid item xs={12} sm={4} lg={3} key="library">
                <DashboardLibraryButton text={t("DashboardView:libraryButton")} link={"/library"} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
}

const useStyles = makeStyles({
  container: {
    width: "100%"
  }
})
