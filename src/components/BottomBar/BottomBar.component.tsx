import React, { useState, Fragment } from 'react';
import { Grid, IconButton, Card, useMediaQuery, makeStyles, FormControl, MenuItem, Select } from '@material-ui/core';
import MenuButton, { MenuButtonWithAddIcon, DropdownAutocomplete } from '../BottomMenuButtons/BottomMenuButtons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { colors } from '../../utils/colors';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { useTranslation } from "react-i18next";
import { ReactComponent as WholenoteIcon } from '../../assets/images/icon_whole-note.svg';
import { ReactComponent as HalfnoteIcon } from '../../assets/images/icon_half-note.svg';
import { ReactComponent as QuarternoteIcon } from '../../assets/images/icon_quarter-note.svg';
import { ReactComponent as EighthnoteIcon } from '../../assets/images/icon_eighth-note.svg';


function DesktopContainer(props: { children: React.ReactNode }) {
  const classes = useStyles();
  return <Grid item xs={12} md={5} xl={3}>
    <Card className={classes.cardsection}>
      <Grid container>
        {props.children}
      </Grid>
    </Card>
  </Grid >
}

function MobileContainer(props: { children: React.ReactNode }) {
  const classes = useStyles();
  return <Grid item xs={8} sm={6}>
    <Card className={classes.minimizedCard}>
      <Grid container>
        {props.children}
      </Grid>
    </Card>
  </Grid>
}

function BottomBar() {
  const { t } = useTranslation();
  const classes = useStyles();
  const desktop = useMediaQuery("(min-width:960px)");
  const [toggle, setToggle] = useState(false);
  const tones: string[] = ["C", "D", "E", "F", "G", "A", "H", "F#", "G#", "A#", "C#", "D#"];

  const [note, setNote] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNote(event.target.value as number);
  };

  const Menu =
    <FormControl variant="outlined" fullWidth classes={{ root: classes.removeDefaultStyling }}>
      <Select
        value={note}
        onChange={handleChange}
        inputProps={{ className: classes.input }}
      >
        <MenuItem value={1}><WholenoteIcon /></MenuItem>
        <MenuItem value={2}> <HalfnoteIcon /></MenuItem>
        <MenuItem value={3}> <QuarternoteIcon /></MenuItem>
        <MenuItem value={4}> <EighthnoteIcon /></MenuItem>
      </Select>
    </FormControl>

  return (

    < Grid container justify="center" className={classes.outercontainer} >
      <Grid item xs={12} sm={10} >
        <Grid container className={classes.container} >

          {desktop ?
            <Fragment>
              <DesktopContainer>
                <Grid item xs={3}>
                  {Menu}
                </Grid>
                <Grid item xs={3}>
                  <DropdownAutocomplete icon={<MusicNoteIcon fontSize="small" />} tones={tones} />
                </Grid>
                <Grid item xs={3}>
                  <MenuButton text={t("BottomBar:chord")} link={"/song"} />
                </Grid>
                <Grid item xs={3}>
                  <MenuButton text={t("BottomBar:note")} link={"/song"} />
                </Grid>
              </DesktopContainer>
              <DesktopContainer>
                <Grid item xs={5} >
                  <MenuButtonWithAddIcon text={t("BottomBar:addTone")} link={"/dashboard"} />
                </Grid>
                <Grid item xs={5} >
                  <MenuButtonWithAddIcon text={t("BottomBar:addBar")} link={"/dashboard"} />
                </Grid>
                <Grid item xs={2} className={classes.vertiIcon}  >
                  <MoreVertIcon />
                </Grid>
              </DesktopContainer>
            </Fragment>
            :
            <Fragment>
              <Grid container style={{ display: (toggle && !desktop) ? " " : " none" }}>
                <Grid item xs={12} className={classes.container}  >
                  <Grid container className={classes.popupcontainer}>
                    <Grid item xs={6} >
                      <MenuButtonWithAddIcon text={t("BottomBar:addTone")} link={"/dashboard"} />
                    </Grid>
                    <Grid item xs={6} >
                      <MenuButtonWithAddIcon text={t("BottomBar:addBar")} link={"/dashboard"} />
                    </Grid>
                    <Grid item xs={6} >
                      <MenuButtonWithAddIcon text={t("BottomBar:repetition")} link={"/dashboard"} />
                    </Grid>
                    <Grid item xs={6} >
                      <MenuButtonWithAddIcon text={t("BottomBar:addHouse")} link={"/dashboard"} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <MobileContainer>
                <Grid item xs={4}>
                  {Menu}
                </Grid>
                <Grid item xs={4}>
                  <DropdownAutocomplete icon={<MusicNoteIcon fontSize="small" />} tones={tones} />
                </Grid>
                <Grid item xs={4} className={classes.vertiIcon}  >
                  <MoreVertIcon />
                </Grid>
              </MobileContainer>
              <Grid item xs={2}>
                <Card className={classes.addicon}>
                  {toggle ?
                    <IconButton >
                      <RemoveIcon onClick={() => { setToggle(!toggle) }} fontSize="large" />
                    </IconButton>
                    :
                    <IconButton >
                      <AddIcon onClick={() => { setToggle(!toggle) }} fontSize="large" />
                    </IconButton>
                  }
                </Card>
              </Grid>
            </Fragment>
          }
        </Grid>


        {/* Mobile view Popup section */}



      </Grid>
    </Grid >
  );
}

const useStyles = makeStyles({
  outercontainer: {
    position: "fixed",
    bottom: "5vh",
    left: 0,
    right: 0
  },
  container: {
    justifyContent: "space-between",
    height: "60px"
  },
  cardsection: {
    display: "flex",
    textAlign: "center",
  },
  vertiIcon: {
    margin: "auto",
    textAlign: "center"
  },
  containerSegment: {
    margin: "auto"
  },
  minimizedCard: {
    margin: "auto"
  },
  addicon: {
    backgroundColor: "white",
    textAlign: "center",
    marginLeft: "auto",
    width: "56px",
    height: "56px"
  },
  popupcontainer: {
    backgroundColor: colors.white,
    bottom: "600px"
  },
  input: {
    padding: "18px 10px 10px 10px",
    height: "28px",

  },
  removeDefaultStyling: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "0px",
    },

  }

});

export default BottomBar;