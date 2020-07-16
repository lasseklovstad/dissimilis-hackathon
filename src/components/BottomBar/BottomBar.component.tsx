import React, { useState, useContext } from 'react';
import { makeStyles, FormControl, MenuItem, Select, Typography, withStyles } from '@material-ui/core';
import { DropdownAutocomplete, MenuButtonWithAddIcon } from '../BottomMenuButtons/BottomMenuButtons';
import { colors } from '../../utils/colors';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { useTranslation } from "react-i18next";
import { ReactComponent as WholenoteIcon } from '../../assets/images/icon_whole-note.svg';
import { ReactComponent as HalfnoteIcon } from '../../assets/images/icon_half-note.svg';
import { ReactComponent as QuarternoteIcon } from '../../assets/images/icon_quarter-note.svg';
import { ReactComponent as EighthnoteIcon } from '../../assets/images/icon_eighth-note.svg';
import { SongContext } from '../../views/SongView/SongContextProvider.component';
import { notes } from '../../models/notes';
import { chords } from '../../models/chords';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        color: colors.black,

        margin: theme.spacing(1),
        border: 'none',
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
    }
}))(ToggleButtonGroup);

function BottomBar() {
    const { t } = useTranslation();
    const classes = useStyles();
    const noteArray: string[] = Object.keys(notes);
    const chordArray: string[] = Object.keys(chords);
    const [note, setNote] = React.useState(8);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setNote(event.target.value as number);
    };
    const { addEmptyBar } = useContext(SongContext);
    const Menu =
        <FormControl variant="outlined" fullWidth classes={{ root: classes.removeDefaultStyling }}>
            <Select
                value={note}
                onChange={handleChange}
                inputProps={{ className: classes.input }}
            >
                <MenuItem value={8}> <WholenoteIcon /></MenuItem>
                <MenuItem value={4}> <HalfnoteIcon /></MenuItem>
                <MenuItem value={2}> <QuarternoteIcon /></MenuItem>
                <MenuItem value={1}> <EighthnoteIcon /></MenuItem>
            </Select>
        </FormControl>


    const [toggle, setToggle] = useState<boolean>(true);

    const handleToggle = (event: React.MouseEvent<HTMLElement>, newToggle: boolean) => {
        if (newToggle !== null) {
            setToggle(newToggle);
        }
    };

    return (

        <div className={classes.outercontainer}>
            <div className={classes.container} >
                <div className={classes.flexelement}>
                    {Menu}
                </div>
                <div className={classes.flexelement}>
                    <DropdownAutocomplete icon={<MusicNoteIcon fontSize="small" />} notesOrChords={toggle === true ? chordArray : noteArray} noOptionsText={t("BottomBar:noOptions")} />
                </div>
                <StyledToggleButtonGroup value={toggle} exclusive onChange={handleToggle} className={classes.flexelement} size="small">
                    <ToggleButton value={true}>
                        <Typography>{t("BottomBar:chord")}</Typography>
                    </ToggleButton>
                    <ToggleButton value={false}>
                        <Typography>{t("BottomBar:note")}</Typography>
                    </ToggleButton>
                </StyledToggleButtonGroup>


            </div>

            <div className={classes.container} >
                <MenuButtonWithAddIcon text={t("BottomBar:addTone")} link={"/song"} />
                <MenuButtonWithAddIcon text={t("BottomBar:addBar")} onClick={() => addEmptyBar()} />
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
        '& .Mui-selected': {
            color: colors.black
        }
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
            border: "0",
        },

    },
    removeDefaultToggleStyling: {
        "& .MuiToggleButton-root": {
            border: "0px"
        },
        "& .MuiToggleButton": {
            border: "10px solid black",
            borderRadius: "100px",
            backgroundColor: "blue"
        },
        "& .MuiToggleButton-label": {
            border: "0px",
            color: colors.black,
        },

    }
});
export default BottomBar;