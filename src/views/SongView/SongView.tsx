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
    const item = localStorage.getItem("measure");
    if (item !== '["2","4"]' && item !== '["3","4"]' && item !== '["4","4"]' && item !== '["6","8"]') history.push({ pathname: "/dashboard" })
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