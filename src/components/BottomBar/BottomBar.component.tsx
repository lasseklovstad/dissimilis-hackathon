import React, { useState, useContext } from 'react';
import { makeStyles, FormControl, MenuItem, Select, Typography, withStyles, Grid } from '@material-ui/core';
import { DropdownAutocomplete, MenuButtonWithAddIcon } from '../BottomMenuButtons/BottomMenuButtons';
import { colors } from '../../utils/colors';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { useTranslation } from "react-i18next";
import { ReactComponent as WholenoteIcon } from '../../assets/images/icon_whole-note.svg';
import { ReactComponent as HalfnoteIcon } from '../../assets/images/icon_half-note.svg';
import { ReactComponent as QuarternoteIcon } from '../../assets/images/icon_quarter-note.svg';
import { ReactComponent as EighthnoteIcon } from '../../assets/images/icon_eighth-note.svg';
import { SongContext } from '../../views/SongView/SongContextProvider.component';
import { visibleNotes as notes } from '../../models/notes';
import { chords } from '../../models/chords';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { SongToolsContext } from '../../views/SongView/SongToolsContextProvider.component';

function BottomBar() {
    const { t } = useTranslation();
    const classes = useStyles();
    const noteArray: string[] = Object.keys(notes);
    let chordArray: string[] = [];
    chords.map(chord => chordArray.push(chord.name));
    const { selectedNoteLength, setSelectedNoteLength } = useContext(SongToolsContext);
    const { addEmptyBar, getTimeSignature } = useContext(SongContext);
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedNoteLength(event.target.value as 1 | 2 | 4 | 8);
        setShowPossiblePositions(false);
    };
    let timeSignatureNumerator = getTimeSignature()[0];
    if (getTimeSignature()[1] === 4) timeSignatureNumerator *= 2;
    const Menu =
    <FormControl variant="outlined" fullWidth classes={{ root: classes.removeDefaultStyling }}>
            <Select
                value={selectedNoteLength}
                onChange={handleChange}
                inputProps={{ className: classes.input }}
                >
                <MenuItem value={8} style={{ display: timeSignatureNumerator < 8 ? "none" : "block" }}> <WholenoteIcon /></MenuItem>
                <MenuItem value={4} style={{ display: timeSignatureNumerator < 4 ? "none" : "block" }}> <HalfnoteIcon /></MenuItem>
                <MenuItem value={2}> <QuarternoteIcon /></MenuItem>
                <MenuItem value={1}> <EighthnoteIcon /></MenuItem>
            </Select>
        </FormControl>


const [toggle, setToggle] = useState<boolean>(true);
const { showPossiblePositions, setShowPossiblePositions, showAvailableSpace, setNoteIsSelected, noteIsSelected } = useContext(SongToolsContext)

const handleToggle = (event: React.MouseEvent<HTMLElement>, newToggle: boolean) => {
    if (newToggle !== null) {
        setToggle(newToggle);
        setNoteIsSelected(!noteIsSelected);
    }
};

const scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
}

return (
    <Grid container justify="center">
            <Grid item xs={12} sm={10} className={classes.outercontainer}>
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
                    <MenuButtonWithAddIcon selected={showPossiblePositions} text={t("BottomBar:addTone")} onClick={() => { if (!showPossiblePositions) { showAvailableSpace() }; setShowPossiblePositions(!showPossiblePositions) }} />
                    <MenuButtonWithAddIcon text={t("BottomBar:addBar")} onClick={() => { setShowPossiblePositions(false); addEmptyBar(); scrollToBottom(); }} />
                </div>
            </Grid>
        </Grid>
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
        marginBottom: "24px",
        justifyContent: "space-between",
        alignItems: "flex-end",
        '@media (max-width: 960px)': {
            flexDirection: "column",
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
    
    input: {
        padding: "18px 10px 10px 10px",
        height: "28px",
    },
    removeDefaultStyling: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "0",
        }
    }
});

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


export default BottomBar;