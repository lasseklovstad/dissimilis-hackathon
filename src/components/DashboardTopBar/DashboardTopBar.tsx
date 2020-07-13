import React, { useState, FC } from 'react';
import {Box, Grid, TextField, AppBar, makeStyles} from '@material-ui/core'
import { DashboardTopBarIcon } from '../../components/DashboardButtons/DashboardButtons'
import { useTranslation } from 'react-i18next';

type TopBarProps = {
  onFocus: Function,
  onBlur: Function
};

export const DashboardTopBar: FC<TopBarProps> = (props: TopBarProps) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const searchPlaceholder = t("DashboardView:search");

  const [searchBarFocus, setSearchBarFocus] = useState(false);

  function handleOnFocus(){
    setSearchBarFocus(true)
    props.onFocus()
  }

  function handleOnBlur(){
    setSearchBarFocus(false)
    props.onBlur()
  }
  
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
                <TextField id="standard-basic" label={searchPlaceholder} variant="outlined" fullWidth onFocus={handleOnFocus} onBlur={handleOnBlur}   />
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