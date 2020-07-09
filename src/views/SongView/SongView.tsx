import React, { useEffect } from 'react';
import NavBarCreateSong from '../../components/NavBarCreateSong/NavBarCreateSong';
import CreateSongTab from '../../components/CreateSongTab/CreateSongTab';
import { Grid, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


export type SongViewProps = {

}
export const SongView: React.FC<SongViewProps> = props => {
  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("measure") === null) history.push({ pathname: "/dashboard" })
  }, [history]);


  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} >
        <NavBarCreateSong />
      </Grid>
      <Grid item xs={12}>
        <CreateSongTab />
      </Grid>
    </Grid>

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