import React from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, Box } from '@material-ui/core';

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

  );
}

export default SongView;