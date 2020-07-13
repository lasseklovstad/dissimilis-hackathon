import React, { useState } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from "react-i18next";
import { DashboardButtonWithAddIcon, DashboardButton, DashboardLibraryButton } from '../../components/DashboardButtons/DashboardButtons';
import { DashboardTopBar } from '../../components/DashboardTopBar/DashboardTopBar'
import testData from './DashboardTestData';
import { writeStorage } from '@rehooks/local-storage';

export type DashboardViewProps = {

}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const { t } = useTranslation();
  const [recentSongs, setRecentSongs] = useState(testData);
  const measureText = t("DashboardView:measure");
  const [dashboardView, setDashboardView] = useState(true);
  const musicTacts = [
    {
      id: 1,
      text: "2/4-" + measureText,
      link: "/song"
    },
    {
      id: 2,
      text: "3/4-" + measureText,
      link: "/song"
    },
    {
      id: "3",
      text: "4/4-" + measureText,
      link: "/song"
    },
    {
      id: 4,
      text: "6/8-" + measureText,
      link: "/song"
    }
  ];
  const styles = useStyles()
  const marginBottom = 4;

  const storeTimeSignatureToLocalStorage = (data: string) => {
    const regex = /[0-9]+/g;
    const newData = data.match(regex);
    writeStorage("timeSignature", newData)
  }

  const handleOnFocus = () => {
    setDashboardView(false)
  }
  const handleOnBlur = () => {
    setDashboardView(true)
  }

  return (
    
    <Box mx={2}>
      <Grid container justify="center" className={styles.container}>

        <Grid item xs={12}>
          <Box mb={marginBottom}>
            <DashboardTopBar onFocus={handleOnFocus} onBlur={handleOnBlur} />
          </Box>
        </Grid>

        {dashboardView && 
        <Grid item xs={12} sm={10} key="newSongContainer">
          <Box mb={marginBottom}>
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:newSongLabel")}</Typography>
            </Box>
            <Grid container spacing={3}>
              {musicTacts.map(songs => (
                <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                  <DashboardButtonWithAddIcon func={() => storeTimeSignatureToLocalStorage(songs.text)} text={songs.text} link={songs.link} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        } 
        
        {dashboardView && 
        <Grid item xs={12} sm={10} key="recentSongsContainer">
          <Box mb={marginBottom}>
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:recentSongLabel")}</Typography>
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
          </Box>
        </Grid>
        }

      {!dashboardView && 
        <Grid item xs={12} sm={10} key="searchSongsContainer">
          <Box mb={marginBottom}>
            <Box m={2}>
              <Typography variant="h1">{t("DashboardView:searchSongLabel")}</Typography>
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
          </Box>
        </Grid>
        }
            
      </Grid>
    </Box>

  );
}
export default DashboardView;

const useStyles = makeStyles({
  container: {
    width: "100%"
  }
})
