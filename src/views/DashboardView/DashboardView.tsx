import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from "react-i18next";
import { DashboardButton, DashboardLibraryButton, DashboardButtonWithAddIconNoLink } from '../../components/DashboardButtons/DashboardButtons';
import DashboardTopBar from '../../components/DashboardTopBar/DashboardTopBar'
import { useGetRecentSongs } from '../../utils/useGetRecentSongs';
import { ISong } from '../../models/ISong';
import { CustomModal } from '../../components/CustomModal/CustomModal'

export type DashboardViewProps = {

}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const { t } = useTranslation();
  const measureText = t("DashboardView:measure");
  const [recentSongs, setRecentSongs] = useState<ISong[]>([])
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeSignature, setTimeSignature] = useState("");
  const [textFieldInput, setTextFieldInput] = useState<string>("");
  const getRecentSongs = useGetRecentSongs()
  const musicTacts: musicTacts[] = [
    {
      id: 1,
      text: "2/4",
    },
    {
      id: 2,
      text: "3/4",
    },
    {
      id: 3,
      text: "4/4",
    },
    {
      id: 4,
      text: "6/8",
    }
  ];
  const styles = useStyles()
  const marginBottom = 4;

  useEffect(() => {
    getRecentSongs().then(({ result }) => setRecentSongs(result?.data || []))
  }, [])


  const handleAddSong = () => {
    console.log("Add song " + timeSignature + " " + textFieldInput)
    setModalIsOpen(false)
    //

  }

  const handleOpen = (song: musicTacts) => {
    setTimeSignature(song.text)
    setModalIsOpen(true);
    console.log(modalIsOpen);
  };

  const handleClose = () => {
    setModalIsOpen(false);
  };


  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
    console.log(e.target.value)
    setTextFieldInput(e.target.value);
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
              {musicTacts.map(song => (
                <Grid item xs={12} sm={4} lg={3} key={song.id}>
                  <DashboardButtonWithAddIconNoLink func={() => handleOpen(song)} text={song.text + "-" + measureText} />
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
        <CustomModal handleOnCancelClick={() => handleClose}
          handleOnSaveClick={() => handleAddSong}
          handleClosed={() => handleClose}
          handleOpen={() => handleOpen}
          modalOpen={modalIsOpen}
          saveText={t("CreateSongTab:save")}
          cancelText={t("CreateSongTab:cancel")}
          headerText={t("CreateSongTab:addInstrument")}
          labelText={t("CreateSongTab:nameOfInstrument")}
          handleChange={() => handleChange}
          textFieldInput={textFieldInput} />
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

export type musicTacts = {
  id: number,
  text: string,
}


