import React, { useState } from 'react';
import colors from '../../utils/colors';
import {Box, Grid, Icon, TextField, AppBar, makeStyles} from '@material-ui/core'
import { DashboardTopBarIcon } from '../../components/DashboardButtons/DashboardButtons'
import { useTranslation } from 'react-i18next';

export default function DashboardTopBar() {
  const classes = useStyles();
  const {t, i18n} = useTranslation();
  const searchPlaceholder = t("DashboardView:search");

  const [searchBarFocus, setSearchBarFocus] = useState(false);
  let searchbarSizing:[5|3,3|5] = [5, 3];
  if(searchBarFocus){
    searchbarSizing = [3, 5];
  }else{
    searchbarSizing = [5, 3]
  }

  return (
    <div>
      <AppBar position="static" className={classes.background} >
        <Box mt={2} py={2} className={classes.container}>
            <Grid container spacing={2}>
              <Grid item sm={1} />
              <Grid item xs={2} >
                <DashboardTopBarIcon />
              </Grid>
              <Grid item xs={6} sm={searchbarSizing[0]} />
              <Grid item xs={12} sm={searchbarSizing[1]}>
                <TextField id="standard-basic" label={searchPlaceholder} variant="outlined" fullWidth onFocus={() => setSearchBarFocus(true)} onBlur={() => setSearchBarFocus(false)}  />
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
  container: {
    marginTop: "auto",
    verticalAlign: "center"
  }
}));