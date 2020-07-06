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
import {useTranslation} from "react-i18next";


function LoginView() {
  const {t, i18n} = useTranslation();
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  return (

    <Grid container className={classes.root} >
      <BackgroundImage className={classes.backgroundimage} />
      <Grid item xs={10} sm={4} className={matches ? classes.container + " " + classes.paddinglarge : classes.container + " " + classes.paddingsmall}>
        <LoginLogo className={classes.loginlogo} />
        <TextField className={classes.textfield} fullWidth label={t("LoginView:username")} variant="filled"></TextField>
        <TextField className={classes.textfield} fullWidth label={t("LoginView:password")} type="password" variant="filled"></TextField>
        <Button to='/dashboard' component={Link} className={classes.loginbutton} fullWidth variant="outlined">{t("LoginView:login")}</Button>
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
    paddingsmall: {
      padding: "40px",
      marginTop: '4vh',
    },
    paddinglarge: {
      padding: "48px"
    },
    textfield: {
      marginTop: '16px'
    },
    loginlogo: {
      width: '60%'
    },
    loginbutton: {
      marginTop: '20px',
      lineHeight: '24px',
      textTransform: 'none'
    },
    backgroundimage: {
      position: 'absolute',
      zIndex: 1,
      width: '50%',
      height: '50%',
      left: 0
    }
  });