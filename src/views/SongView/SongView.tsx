import React from 'react';
import { Grid, Box } from '@material-ui/core';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';

export type SongViewProps = {

}

function SongView() {

  return ( 
          <Grid container spacing={2} style={{marginLeft: "24px", marginTop: "32px"}}>
            <Grid item xs={12} >
              <NavBarCreateSong />
            </Grid>
            <Grid item xs={12}>
              <CreateSongTab />
            </Grid>
          </Grid>
  )}

export default SongView;