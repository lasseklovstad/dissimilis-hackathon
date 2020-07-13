import React, { useState } from 'react';
import { Grid, IconButton, Card, useMediaQuery, makeStyles, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import MenuButton, { MenuButtonWithAddIcon, DropdownAutocomplete } from '../../components/BottomMenuButtons/BottomMenuButtons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { colors } from '../../utils/colors';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { useTranslation } from "react-i18next";
import wholeNote from '../../assets/images/icon_whole-note.svg';
import halfNote from '../../assets/images/icon_half-note.svg';
import quarterNote from '../../assets/images/icon_quarter-note.svg';
import eighthNote from '../../assets/images/icon_eighth-note.svg';



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
  const matches = useMediaQuery("(min-width:960px)");
  const [toggle, setToggle] = useState(false);
  const tones: string[] = ["C", "D", "E", "F", "G", "A", "H"];
  const [note, setNote] = React.useState('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNote(event.target.value as string);

  };

  return (

    < Grid container justify="center" className={classes.outercontainer}>
      <Grid item xs={12} sm={10} >
        {!matches ? null :
          <Grid container className={classes.container} >

            <DesktopContainer>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth >

                  {/* <InputLabel id="testLabel">{t("BottomBar:note")}</InputLabel> */}
                  <Select


                    value={note}
                    onChange={handleChange}
                    className={classes.dropdownselect}
                    displayEmpty
                    inputProps={{ className: classes.input }}

                  >
                    <MenuItem value="" disabled >
                      <em>Note</em>
                    </MenuItem>
                    <MenuItem value={1}>{<img src={wholeNote} alt={t("BottomBar:wholeNote")} />}</MenuItem>
                    <MenuItem value={2}>{<img src={halfNote} alt={t("BottomBar:halfNote")} />}</MenuItem>
                    <MenuItem value={3}>{<img src={quarterNote} alt={t("BottomBar:quarterNote")} />}</MenuItem>
                    <MenuItem value={4}>{<img src={eighthNote} alt={t("BottomBar:eighthNote")} />}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <DropdownAutocomplete text={<MusicNoteIcon fontSize="small" />} tones={tones} />
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

          </Grid>
        }

        {/* Mobile view */}

        {matches ? null :
          <Grid container className={classes.container}>

            <MobileContainer>

              <Grid item xs={4}>
                <FormControl variant="outlined" fullWidth >
                  {/* <InputLabel id="testLabel">{t("BottomBar:note")}</InputLabel> */}
                  <Select


                    value={note}
                    onChange={handleChange}
                    className={classes.dropdownselect}
                    displayEmpty
                    inputProps={{ className: classes.input }}

                  >
                    <MenuItem value="" disabled>
                      <em>Note</em>
                    </MenuItem>
                    <MenuItem value={1}>{<img src={wholeNote} alt={t("BottomBar:wholeNote")} />}</MenuItem>
                    <MenuItem value={2}>{<img src={halfNote} alt={t("BottomBar:halfNote")} />}</MenuItem>
                    <MenuItem value={3}>{<img src={quarterNote} alt={t("BottomBar:quarterNote")} />}</MenuItem>
                    <MenuItem value={4}>{<img src={eighthNote} alt={t("BottomBar:eighthNote")} />}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <DropdownAutocomplete text={<MusicNoteIcon fontSize="small" />} tones={tones} />
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
                    {window.scrollTo(0, document.body.scrollHeight)}
                  </IconButton>
                  :
                  <IconButton >
                    <AddIcon onClick={() => { setToggle(!toggle) }} fontSize="large" />
                    {window.scrollTo(0, document.body.scrollHeight)}
                  </IconButton>
                }
              </Card>
            </Grid>
          </Grid>}
      </Grid>


      {/* Mobile view Popup section */}

      <Grid container style={{ display: (toggle && !matches) ? " " : " none" }}>
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
    </Grid >

  );
}

const useStyles = makeStyles({

  outercontainer: {
    position: "fixed",
    bottom: "5vh",
    left: 0
  },

  container: {
    justifyContent: "space-between",
    marginBottom: "1rem",
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
  },
  dropdownselect: {
    backgroundColor: ""
  },
  input: {
    padding: "18px 10px 10px 10px",
    height: "28px",

  }

});

export default BottomBar;