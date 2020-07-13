import React from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles } from '@material-ui/core';
import SongContextProvider from "./SongContextProvider.component";

export type SongViewProps = {

}
export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();


  return (
    <SongContextProvider>
      <Grid container className={classes.root}>
        <Grid item xs={12} >
          <NavBarCreateSong />
        </Grid>
        <Grid item xs={12}>
          <CreateSongTab />
        </Grid>
      </Grid>
    </SongContextProvider >

  );
}

const useStyles = makeStyles({
  root: {
    marginLeft: "24px",
    marginTop: "32px",
    marginRight: "32px",
    width: "auto",
  }
})

export default SongView;