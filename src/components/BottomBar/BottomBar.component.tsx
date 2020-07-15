import React, { useState } from 'react';
import { useMediaQuery, makeStyles, FormControl, MenuItem, Select, } from '@material-ui/core';
import MenuButton, { DropdownAutocomplete, MenuButtonWithAddIcon } from '../BottomMenuButtons/BottomMenuButtons';
import { colors } from '../../utils/colors';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { useTranslation } from "react-i18next";
import { ReactComponent as WholenoteIcon } from '../../assets/images/icon_whole-note.svg';
import { ReactComponent as HalfnoteIcon } from '../../assets/images/icon_half-note.svg';
import { ReactComponent as QuarternoteIcon } from '../../assets/images/icon_quarter-note.svg';
import { ReactComponent as EighthnoteIcon } from '../../assets/images/icon_eighth-note.svg';


function BottomBar() {
    const { t } = useTranslation();
    const classes = useStyles();
    const desktop = useMediaQuery("(min-width:960px)");

    const tones: string[] = ["C", "D", "E", "F", "G", "A", "H", "F#", "G#", "A#", "C#", "D#"];
    const [note, setNote] = React.useState(1);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setNote(event.target.value as number);
    };
    /* Icon dropdown with note values */
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

        <div className={classes.outercontainer}>
            <div className={classes.container} >
                <div className={classes.flexelement}>
                    {Menu}
                </div>
                <div className={classes.flexelement}>
                    <DropdownAutocomplete icon={<MusicNoteIcon fontSize="small" />} tones={tones} />
                </div>
                <div className={classes.flexelement}>
                    <MenuButton text={t("BottomBar:chord")} link={"/song"} />
                </div>
                <div className={classes.flexelement}>
                    <MenuButton text={t("BottomBar:note")} link={"/song"} />
                </div>
            </div>

            <div className={classes.container} >
                <MenuButtonWithAddIcon text={t("BottomBar:addTone")} link={"/song"} />
                <MenuButtonWithAddIcon text={t("BottomBar:addBar")} link={"/song"} />
            </div>
        </div>

    );
}
const useStyles = makeStyles({
    outercontainer: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexBasis: "auto",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "24px",
        justifyContent: "space-around",
        '@media (max-width: 980px)': {
            flexDirection: "column",
            alignItems: "flex-end",
        }
    },
    container: {
        boxShadow: '0 1px 3px 1px rgba(0, 0, 0, 0.1)',
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        backgroundColor: colors.white,
        marginBottom: "8px",
        marginLeft: "24px",
        marginRight: "24px",
    },
    flexelement: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,

    },
    button: {
        backgroundColor: colors.white,
        border: "none",
        height: "56px",
        outline: "none",
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