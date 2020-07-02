import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useMediaQuery } from '@material-ui/core';
import { ReactComponent as BackgroundImage } from '../../assets/images/butterflyGreen.svg';
import { ReactComponent as LoginLogo } from '../../assets/images/LoginLogo.svg';
import { colors } from '../../utils/colors';
import { Link } from 'react-router-dom';


function LoginView() {
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  return (

    <Grid container className={classes.root} >
      <BackgroundImage className={classes.BackgroundImage} />
      <Grid item xs={10} sm={4} className={matches ? classes.container + " " + classes.PaddingLarge : classes.container + " " + classes.PaddingSmall}>
        <LoginLogo className={classes.LoginLogo} />
        <TextField className={classes.Textfield} fullWidth label="Brukernavn" variant="filled"></TextField>
        <TextField className={classes.Textfield} fullWidth label="Passord" variant="filled"></TextField>
        <Button to='/dashboard' component={Link} className={classes.LoginButton} fullWidth variant="outlined">Logg Inn</Button>
      </Grid>
    </Grid>
  );
}
export default LoginView;

const useStyles = makeStyles(
  {
    root: {
      justifyContent: 'center'
    },
    container: {
      boxShadow: '0 3px 6px 2px rgba(0, 0, 0, 0.1)',
      borderRadius: 2,
      backgroundColor: colors.gray_100,
      marginTop: '10vh',
      zIndex: 2,
    },
    PaddingSmall: {
      padding: "40px",
      marginTop: '4vh',
    },
    PaddingLarge: {
      padding: "48px"
    },
    Textfield: {
      marginTop: '16px'
    },
    LoginLogo: {
      width: '60%'
    },
    LoginButton: {
      marginTop: '20px',
      lineHeight: '24px',
      textTransform: 'none'
    },
    BackgroundImage: {
      position: 'absolute',
      zIndex: 1,
      width: '50%',
      height: '50%',
      left: 0
    }
  });