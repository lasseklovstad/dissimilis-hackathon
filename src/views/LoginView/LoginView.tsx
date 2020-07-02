import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import { FormControl, useMediaQuery } from '@material-ui/core';

import { ReactComponent as Logo} from 'C:/Users/kbform/Documents/Dissimilis/dissimilis_pwa_react/Dissimilis-pwa-react/src/assets/images/butterflyBlue.svg';


const useStyles = makeStyles(
  {
    /* imageBackground: {
      backgroundImage: `url("${Background}")`
    },
 */
    root: {
      backgroundColor: '#FAFAFA',
      paddingBottom: '500px'
    },
    container: {
      boxShadow: '0 3px 6px 2px rgba(0, 0, 0, 0.5)',
      borderRadius: 2,
      backgroundColor: 'white',
      marginTop: '10vh'
    },
    paddingSmall: {
      padding: "10px"
    },
    paddingLarge: {
      padding: "48px"
    },
    textfield: {
      marginTop: '16px'
    }

  });

function LoginView() {
  const matches = useMediaQuery("(min-width:600px)");
  console.log(matches);
  const classes = useStyles()
  return (

    <Grid container className={classes.root} justify='center'>
      
      <Grid item xs={10} sm={4} className={matches ? classes.container + " " + classes.paddingLarge : classes.container + " " + classes.paddingSmall}>
      <Logo />
        <TextField className={classes.textfield} fullWidth label="Brukernavn" variant="filled"></TextField>
        <TextField className={classes.textfield} fullWidth label="Passord" variant="filled"></TextField>
        <Button className={classes.textfield} fullWidth variant="outlined">Logg Inn</Button>

        

      </Grid>

    </Grid>





  );
}

export default LoginView;