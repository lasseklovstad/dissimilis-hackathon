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
  const classes = useStyles()
  return (

    <Grid container className={classes.root} >

      <BackgroundImage className={classes.backgroundImage} />

      <Grid item xs={10} sm={4} className={matches ? classes.container + " " + classes.paddingLarge : classes.container + " " + classes.paddingSmall}>
        <LoginLogo className={classes.LoginLogo} />
        <TextField className={classes.textfield} fullWidth label="Brukernavn" variant="filled"></TextField>
        <TextField className={classes.textfield} fullWidth label="Passord" variant="filled"></TextField>
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
    paddingSmall: {
      padding: "40px",
      marginTop: '4vh',
    },
    paddingLarge: {
      padding: "48px"
    },
    textfield: {
      marginTop: '16px'
    },
    LoginLogo: {
      width: '50%'
    },
    LoginButton: {
      marginTop: '20px',
      lineHeight: '24px',
      textTransform: 'none'
    },
    backgroundImage: {
      position: 'absolute',
      zIndex: 1,
      width: '40%',
      height: '40%',
      left: 0
    }
  });