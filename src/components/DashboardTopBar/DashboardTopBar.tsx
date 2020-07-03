import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import colors from '../../utils/colors';
import {Box, Grid, Icon} from '@material-ui/core'
import { DashboardTopBarIcon } from '../../components/DashboardButtons/DashboardButtons'

export default function DashboardTopBar() {
  const classes = useStyles();
  const [searchBarFocus, setSearchBarFocus] = useState(false);

  return (
    <div>
      <AppBar position="static" className={classes.background} >
        <Box mt={2} py={2} className={classes.container}>
            <Grid container spacing={2}>
              <Grid item xs={1} />
              <Grid item xs={4} sm={1}>
                <DashboardTopBarIcon />
              </Grid>
              <Grid item sm={6} />
              <Grid item sm={3}>
                <Box>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                    placeholder="Søk"
                    classes={{
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'søk' }}
                    />
                  </div>
                </Box>
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
  },
  search: {
    position: "relative",
    width: '100%',
    border: '1px solid '+colors.gray_400,
    borderRadius: '2px',
    backgroundColor: colors.gray_100,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.black
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));