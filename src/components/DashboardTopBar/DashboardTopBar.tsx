import React, { useState } from 'react';
import {Box, Grid, TextField, AppBar, makeStyles} from '@material-ui/core'
import { DashboardTopBarIcon } from '../../components/DashboardButtons/DashboardButtons'
import { useTranslation } from 'react-i18next';

export default function DashboardTopBar() {
  const classes = useStyles();
  const {t} = useTranslation();
  const searchPlaceholder = t("DashboardView:search");

  const [searchBarFocus, setSearchBarFocus] = useState(false);
  
  return (
    <div>
      <AppBar position="static" className={classes.background} >
        <Box py={3}>
            <Grid container spacing={2}>
              <Grid item sm={1} />
              <Grid item xs={2} >
                <DashboardTopBarIcon />
              </Grid>
              <Grid item xs={6} sm={searchBarFocus ? 2 : 5} md={searchBarFocus ? 3 : 5}/>
              <Grid item xs={12} sm={searchBarFocus ? 6 : 3} md={searchBarFocus ? 5 : 3}>
                <TextField id="standard-basic" label={searchPlaceholder} variant="outlined" fullWidth onFocus={() => setSearchBarFocus(true)} onBlur={() => setSearchBarFocus(false)}   />
              </Grid>
          </Grid>
        </Box>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    background: 'transparent',
    boxShadow: 'none',
  },
  
}));