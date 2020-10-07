import React, { useContext, useState } from "react"
import {
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    Select,
    Typography,
    withStyles,
} from "@material-ui/core"
import MusicNoteIcon from "@material-ui/icons/MusicNote"
import { useTranslation } from "react-i18next"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
import {
    DropdownAutocomplete,
    MenuButtonWithAddIcon,
} from "../BottomMenuButtons/BottomMenuButtons"
import { colors } from "../../utils/colors"
import { ReactComponent as WholenoteIcon } from "../../assets/images/icon_whole-note.svg"
import { ReactComponent as HalfnoteIcon } from "../../assets/images/icon_half-note.svg"
import { ReactComponent as QuarternoteIcon } from "../../assets/images/icon_quarter-note.svg"
import { ReactComponent as EighthnoteIcon } from "../../assets/images/icon_eighth-note.svg"
import { ReactComponent as HalfnoteDottedIcon } from "../../assets/images/icon_half-note-dotted.svg"
import { ReactComponent as QuarternoteDottedIcon } from "../../assets/images/icon_quarter-note-dotted.svg"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { visibleNotes as notes } from "../../models/notes"
import { chords } from "../../models/chords"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"

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
        "@media (max-width: 960px)": {
            flexDirection: "column",
        },
    },
    container: {
        boxShadow: "0 1px 3px 1px rgba(0, 0, 0, 0.1)",
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
        "& .Mui-selected": {
            color: colors.black,
        },
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
})

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {
        color: colors.black,
        margin: theme.spacing(1),
        border: "none",
        "&:not(:first-child)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-child": {
            borderRadius: theme.shape.borderRadius,
        },
    },
}))(ToggleButtonGroup)

export const BottomBar = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const noteArray: string[] = Object.keys(notes)
    const chordArray: string[] = []
    chords.map((chord) => chordArray.push(chord.name))
    const { selectedNoteLength, setSelectedNoteLength } = useContext(
        SongToolsContext
    )
    const {
        addEmptyBar,
        song: { denominator, numerator },
    } = useContext(SongContext)
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedNoteLength(event.target.value as 1 | 2 | 4 | 8)
    }
    let timeSignatureNumerator = numerator
    if (denominator === 4) timeSignatureNumerator *= 2
    // When adding new notes to this list of MenuItems with a given value, remember to add the case to the method calculateFlexBasis in BarBody.component.tsx.
    const Menu = (
        <FormControl
            variant="outlined"
            fullWidth
            classes={{ root: classes.removeDefaultStyling }}
        >
            <Select
                value={selectedNoteLength}
                onChange={handleChange}
                inputProps={{ className: classes.input }}
            >
                <MenuItem
                    value={8}
                    style={{
                        display: timeSignatureNumerator < 8 ? "none" : "block",
                    }}
                >
                    {" "}
                    <WholenoteIcon />
                </MenuItem>
                <MenuItem
                    value={6}
                    style={{
                        display: timeSignatureNumerator < 6 ? "none" : "block",
                    }}
                >
                    {" "}
                    <HalfnoteDottedIcon />
                </MenuItem>
                <MenuItem
                    value={4}
                    style={{
                        display: timeSignatureNumerator < 4 ? "none" : "block",
                    }}
                >
                    {" "}
                    <HalfnoteIcon />
                </MenuItem>
                <MenuItem
                    value={3}
                    style={{
                        display: timeSignatureNumerator < 3 ? "none" : "block",
                    }}
                >
                    {" "}
                    <QuarternoteDottedIcon />{" "}
                </MenuItem>
                <MenuItem
                    value={2}
                    style={{
                        display: timeSignatureNumerator < 2 ? "none" : "block",
                    }}
                >
                    {" "}
                    <QuarternoteIcon />{" "}
                </MenuItem>
                <MenuItem value={1}>
                    {" "}
                    <EighthnoteIcon />{" "}
                </MenuItem>
            </Select>
        </FormControl>
    )

    const [toggle, setToggle] = useState<boolean>(true)
    const {
        setShowPossiblePositions,
        calculateAvailableSpace,
        setNoteIsSelected,
        noteIsSelected,
    } = useContext(SongToolsContext)
    const handleToggle = (
        event: React.MouseEvent<HTMLElement>,
        newToggle: boolean
    ) => {
        if (newToggle !== null) {
            setToggle(newToggle)
            setNoteIsSelected(!noteIsSelected)
        }
    }

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight)
    }

    return (
        <Grid container justify="center">
            <Grid item xs={12} sm={10} className={classes.outercontainer}>
                <div className={classes.container}>
                    <div className={classes.flexelement}>{Menu}</div>
                    <div className={classes.flexelement}>
                        <DropdownAutocomplete
                            icon={<MusicNoteIcon fontSize="small" />}
                            notesOrChords={
                                toggle === true ? chordArray : noteArray
                            }
                            noOptionsText={t("BottomBar:noOptions")}
                        />
                    </div>
                    <StyledToggleButtonGroup
                        value={toggle}
                        exclusive
                        onChange={handleToggle}
                        className={classes.flexelement}
                        size="small"
                    >
                        <ToggleButton value>
                            <Typography>{t("BottomBar:chord")}</Typography>
                        </ToggleButton>
                        <ToggleButton value={false}>
                            <Typography>{t("BottomBar:note")}</Typography>
                        </ToggleButton>
                    </StyledToggleButtonGroup>
                </div>
                <div className={classes.container}>
                    <MenuButtonWithAddIcon
                        text={t("BottomBar:addBar")}
                        onClick={() => {
                            addEmptyBar()
                            scrollToBottom()
                            calculateAvailableSpace()
                            setShowPossiblePositions(true)
                        }}
                    />
                </div>
            </Grid>
        </Grid>
    )
}
