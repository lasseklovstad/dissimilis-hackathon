import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useMediaQuery, Collapse } from '@material-ui/core';
import { ReactComponent as BackgroundImage } from '../../assets/images/butterflyGreen.svg';
import { ReactComponent as LoginLogo } from '../../assets/images/LoginLogo.svg';
import { colors } from '../../utils/colors';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useLoginRedirect, useLoginPost } from '../../utils/useLogin';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import animatedBird from "../../assets/images/sommerfugl-animert.svg";

export type LoginViewProps = {

}

const LoginView: FC<LoginViewProps> = () => {
  const { t } = useTranslation();
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  const history = useHistory();
  const axiosGet = useLoginRedirect();
  const [isLoading, setIsLoading] = useState(false)
  const tryLogin = () => {
    axiosGet().then(({ result }) => {
      window.open(result?.headers.location, "_self")
    })
  }


  const url = new URLSearchParams(useLocation().search);
  let code = url.get("code") ? url.get("code") : null

  const axiosPost = useLoginPost(code);


  useEffect(() => {
    console.log("Kjører useeffect i loginview")
    if (sessionStorage.getItem("apiKey") && sessionStorage.getItem("userId")) {
      history.push("/dashboard");
    } else if (code !== null) {
      setIsLoading(true);
      axiosPost().then(({ result }) => {
        if (result && result.status === 200) {
          sessionStorage.setItem("apiKey", result.data.apiKey);
          sessionStorage.setItem("userId", result.data.userID?.toString());
          history.push("/dashboard");
        }
      })
    }
  }, [])


  const [warningDisplayed, setWarningDisplayed] = React.useState(false);
  const warning =
    (<Collapse in={warningDisplayed}>
      <Alert
        severity="warning"
        action={
          <IconButton
            size="small"
            onClick={() => {
              setWarningDisplayed(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {t("LoginView:loginFailed")}
      </Alert>
    </Collapse>);


  return (
    <Grid container className={classes.root} >
      <BackgroundImage className={classes.backgroundimage} style={{ display: isLoading ? "none" : "block" }} />
      {isLoading ?
        <Grid item xs={10} sm={6} md={4} xl={2} style={{ boxShadow: "none" }} className={matches ? classes.container + " " + classes.paddinglarge : classes.container + " " + classes.paddingsmall}>
          <object type="image/svg+xml" data={animatedBird} aria-label="bird moving"></object>
        </Grid>
        :
        <Grid item xs={10} sm={6} md={4} xl={2} className={matches ? classes.container + " " + classes.paddinglarge : classes.container + " " + classes.paddingsmall}>
          <LoginLogo className={classes.loginlogo} />
          <TextField className={classes.textfield} fullWidth label={t("LoginView:username")} variant="filled" onSubmit={tryLogin}></TextField>
          <TextField className={classes.textfield} fullWidth label={t("LoginView:password")} type="password" variant="filled" onSubmit={tryLogin}></TextField>
          <Button size="large" className={classes.loginbutton} fullWidth variant="outlined">{t("LoginView:login")}</Button>
          <Button size="large" className={classes.loginbutton} fullWidth variant="outlined" onClick={(tryLogin)}>{t("LoginView:loginWithMicrosoft")}</Button>
          {warning}
        </Grid>
      }
    </Grid >
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
      zIndex: 2
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
      marginTop: '24px',
      marginBottom: '16px',
      lineHeight: '24px',
      textTransform: 'none'
    },
    backgroundimage: {
      position: 'absolute',
      zIndex: 1,
      width: '50%',
      height: '50%',
      left: 0
    },
  }
);