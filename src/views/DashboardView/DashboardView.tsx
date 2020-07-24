import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from "react-i18next";
import { DashboardButton, DashboardLibraryButton, DashboardButtonWithAddIconNoLink, DashboardButtonWithAddIcon } from '../../components/DashboardButtons/DashboardButtons';
import { DashboardTopBar } from '../../components/DashboardTopBar/DashboardTopBar'
import { useGetFilteredSongs } from '../../utils/useGetFilteredSongs';
import { writeStorage } from '@rehooks/local-storage';
import { useGetRecentSongs } from '../../utils/useGetRecentSongs';
import { ISong } from '../../models/ISong';
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { usePostSong } from '../../utils/usePostSong';
import { useHistory } from 'react-router-dom';
import { useGetSong } from '../../utils/useGetSong';

export type DashboardViewProps = {

}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const { t } = useTranslation();
  const measureText = t("DashboardView:measure");
  const [recentSongs, setRecentSongs] = useState<ISong[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeSignature, setTimeSignature] = useState("");
  const [textFieldInput, setTextFieldInput] = useState<string>("");
  // Denne burde ikke være 0
  const [newSongId, setNewSongId] = useState<number>(0)
  const postSong = usePostSong(textFieldInput, timeSignature)
  const getSong = useGetSong(newSongId)
  const history = useHistory();
  const [dashboardView, setDashboardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);
  const getRecentSongs = useGetRecentSongs();
  const getFilteredSongs = useGetFilteredSongs();

  useEffect(() => {
    getRecentSongs().then(({ result }) => { setRecentSongs(result?.data || []) });
  }, [])

  useEffect(() => {
    getFilteredSongs({ "Title": searchTerm }).then(({ result }) => { setFilteredSongs(result?.data || []) });
  }, [searchTerm])



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
    setModalIsOpen(false);
    postSong().then(({ result }) => {
      if (result?.status === 201) {
        setNewSongId(result.data);
        history.push("/song/" + result.data);
      };
    })
  };

  const handleOpen = (song: musicTacts) => {
    setTimeSignature(song.text)
    setModalIsOpen(true);
  };

  const handleClose = () => {
    setModalIsOpen(false);
  };


  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
    setTextFieldInput(e.target.value);
  }

  const handleOnBlur = () => {
    setDashboardView(true)
  }

  const handleOnChange = (searchTerm: string) => {
    setSearchTerm(searchTerm)
    setDashboardView(false)

  }


  return (

    <Box mx={2}>
      <Grid container justify="center" className={styles.container}>

        <Grid item xs={12}>
          <Box mb={marginBottom}>
            <DashboardTopBar onBlur={handleOnBlur} onChange={handleOnChange} />
          </Box>
        </Grid>

        {dashboardView ?
          <Box>
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
                  <Typography variant="h1">{t("DashboardView:recentSongLabel")}</Typography>
                </Box>
                <Grid container spacing={3}>
                  {recentSongs?.map(songs => (
                    <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                      <DashboardButton text={songs.title} link={songs.id!.toString()} />
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

          </Box>
          :

          <Grid item xs={12} sm={10} key="searchSongsContainer">
            <Box mb={marginBottom}>
              <Box m={2}>
                <Typography variant="h1">{t("DashboardView:searchSongLabel")}</Typography>
              </Box>
              <Grid container spacing={3}>
                {filteredSongs?.map(songs => (
                  <Grid item xs={12} sm={4} lg={3} key={songs.id}>
                    <DashboardButton text={songs.title} link={songs.id!.toString()} />
                  </Grid>
                ))}
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

export type musicTacts = {
  id: number,
  text: string,
}


