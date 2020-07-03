import React from 'react';
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


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  background: {
    background: 'transparent',
    boxShadow: 'none'
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'absolute',
    right: 100,
    width: '100%',
    border: '1px solid '+colors.gray_400,
    borderRadius: '2px',
    backgroundColor: colors.gray_100,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
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
  inputRoot: {
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function DashboardTopBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.background} >
        <Toolbar>
            <Box mt={2}>
                <Grid container>
                <Grid item sm={1}>
                    <DashboardTopBarIcon />
                </Grid>
                <Grid item sm={3}>
                    <Box>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                            placeholder="Søk"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'søk' }}
                            />
                        </div>
                    </Box>


                </Grid>
          </Grid>


            </Box>
          
          
          
        </Toolbar>
      </AppBar>
    </div>
  );
}