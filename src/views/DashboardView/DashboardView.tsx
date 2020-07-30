import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { useTranslation } from "react-i18next";
import { DashboardButton, DashboardLibraryButton, DashboardButtonWithAddIconNoLink } from '../../components/DashboardButtons/DashboardButtons';
import { DashboardTopBar } from '../../components/DashboardTopBar/DashboardTopBar'
import { useGetFilteredSongs } from '../../utils/useGetFilteredSongs';
import { useGetRecentSongs } from '../../utils/useGetRecentSongs';
import { ISong } from '../../models/ISong';
import { CustomModal } from '../../components/CustomModal/CustomModal'
import { useHistory } from 'react-router-dom';
import { usePostSong } from '../../utils/usePostSong';
import { useDeleteSong } from '../../utils/useDeleteSong';

export type DashboardViewProps = {

}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const { t } = useTranslation();
  const measureText = t("DashboardView:measure");
  const [recentSongs, setRecentSongs] = useState<ISong[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [timeSignature, setTimeSignature] = useState("");
  const [textFieldInput, setTextFieldInput] = useState<string>("");
  const postSong = usePostSong(textFieldInput, timeSignature);
  const history = useHistory();
  const [dashboardView, setDashboardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);
  const getRecentSongs = useGetRecentSongs();
  const getFilteredSongs = useGetFilteredSongs(searchTerm);
  const styles = useStyles()
  const marginBottom = 4;

  useEffect(() => {
    getRecentSongs().then(({ result }) => { setRecentSongs(result?.data || []) });
  }, [])

  useEffect(() => {
    getFilteredSongs().then(({ result }) => { setFilteredSongs(result?.data || []) });
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

  const handleAddSong = () => {
    setModalIsOpen(false);
    postSong().then(({ result }) => {
      if (result?.status === 201) {
        history.push("/song/" + result.data.id);
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


  const handleOnChangeModal: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
    setTextFieldInput(e.target.value);
  }

  const handleOnBlurSearch = () => {
    setTimeout(() => {
      setDashboardView(true)
    }, 320)
  }

  const handleOnChangeSearch = (searchTermParam: string) => {
    setSearchTerm(searchTermParam)
    setDashboardView(false)
  }


  const [rightClicked, setRightClicked] = useState(-1);
  const [clickedSong, setClickedSong] = useState<number>(-1);
  const deleteSong = useDeleteSong(clickedSong);

  const initialState = {
    mouseX: null,
    mouseY: null,
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setRightClickCoordinates({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleDeleteSong = (method?: string) => {
    if (method === "deleteSong" && clickedSong) {
      deleteSong().then();
    }
    setRightClickCoordinates(initialState);
  };

  return (

    <Box mx={2}>
      <Grid container justify="center" className={styles.container}>

        <Grid item xs={12}>
          <Box mb={marginBottom}>
            <DashboardTopBar onBlur={handleOnBlurSearch} onChange={handleOnChangeSearch} />
          </Box>
        </Grid>

        {dashboardView ?
          <>
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
                  {recentSongs?.map((song, index) => (
                    <Grid item xs={12} sm={4} lg={3} key={song.id}>
                      <DashboardButton onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { setRightClicked(index); setClickedSong(song!.id!); handleClick(e) }} text={song.title} link={"/song/" + song.id!.toString()} />
                      <Menu
                        keepMounted
                        open={rightClickCoordinates.mouseY !== null}
                        onClose={() => { handleDeleteSong("") }}
                        anchorReference="anchorPosition"
                        anchorPosition={
                          rightClickCoordinates.mouseY !== null && rightClickCoordinates.mouseX !== null
                            ? { top: rightClickCoordinates.mouseY, left: rightClickCoordinates.mouseX }
                            : undefined
                        }
                      >
                        <MenuItem onClick={() => { handleDeleteSong("deleteSong") }}>Slett sang</MenuItem>
                      </Menu>
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
              modalOpen={modalIsOpen}
              saveText={t("CreateSongTab:save")}
              cancelText={t("CreateSongTab:cancel")}
              headerText={t("DashboardView:addSong")}
              labelText={t("DashboardView:nameOfSong")}
              handleChange={handleOnChangeModal}
            />

            <Modal open={renameModalIsOpen} onClose={handleClose}>
              <div className={classes.modal} style={modalStyle}>
                <Grid container >
                  <Typography className={classes.title} variant="h2">Vil du slette sang?</Typography>
                  <Grid item xs={12} style={{ marginBottom: "16px" }}>
                    <TextField variant="filled" autoFocus onChange={handleChange} label="Navn" style={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button className={classes.button} size="large" variant="contained" disabled={!textFieldInput} onClick={handleChangeVoiceTitle} >{t("CreateSongTab:saveNewName")}</Button>
                    <Button className={classes.button} size="large" variant="outlined" onClick={() => setRenameModalIsOpen(false)}>{t("CreateSongTab:cancel")}</Button>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          </>
          :

          <Grid item xs={12} sm={10} key="searchSongsContainer">
            <Box mb={marginBottom}>
              <Box m={2}>
                <Typography variant="h1">{t("DashboardView:searchSongLabel")}</Typography>
              </Box>
              <Grid container spacing={3}>
                {filteredSongs?.map(song => (
                  <Grid item xs={12} sm={4} lg={3} key={song.id}>
                    <DashboardButton text={song.title} link={"/song/" + song.id!.toString()} />
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


