import React, { useRef } from "react"
import {
    Box,
    Button,
    ClickAwayListener,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    SvgIcon,
    Typography,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import withStyles from "@mui/styles/withStyles"
import { Delete } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import {
    ChordOptions,
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
import { useAddBar } from "../../utils/useApiServiceSongs"
import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import { useChords } from "../../utils/useChords"
import { SelectedChordIntervals } from "./SelectedChordIntervals.component"

const useStyles = makeStyles({
    outercontainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexBasis: "auto",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-end",
        "@media (max-width: 960px)": {
            flexDirection: "column",
            marginBottom: "16px",
        },
    },
    flexelement: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        "& .Mui-selected": {
            color: colors.black,
        },
    },
    focusElement: {
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    },
    input: {
        padding: "18px 10px 10px 18px",
        height: "28px",
        "&:focus": {
            outline: "none !important",
        },
    },
    removeDefaultStyling: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "0",
        },
    },
    selectIcon: {
        right: 14,
    },
})

const StyledToggleButtonGroup = withStyles((theme) => ({
    grouped: {},
}))(ToggleButtonGroup)

const noteLengths = [
    {
        length: 8,
        Icon: <WholenoteIcon />,
        label: "BottomBar.wholeNote",
    },
    {
        length: 6,
        Icon: <HalfnoteDottedIcon />,
        label: "BottomBar.halfNoteDotted",
    },
    {
        length: 4,
        Icon: <HalfnoteIcon />,
        label: "BottomBar.halfNote",
    },
    {
        length: 3,
        Icon: <QuarternoteDottedIcon />,
        label: "BottomBar.quarterNoteDotted",
    },
    {
        length: 2,
        Icon: <QuarternoteIcon />,
        label: "BottomBar.quarterNote",
    },
    {
        length: 1,
        Icon: <EighthnoteIcon />,
        label: "BottomBar.eighthNote",
    },
]

export const BottomBar = (props: { voiceId: number }) => {
    const { voiceId } = props
    const {
        setValuesForSelectedChord,
        song,
        dispatchSong,
        selectedBarId,
        selectedChordId,
        selectedChordPosition,
        chordMenuOptions,
        dispatchChordMenuOptions,
    } = useSongContext()
    const { songId, numerator, denominator } = song!!
    const { t } = useTranslation()
    const classes = useStyles()
    const chordOptionsRef = useRef<HTMLDivElement>(null)
    const { postBar } = useAddBar(songId, voiceId)

    const {
        handleChangeChord,
        handleChangeChordLength,
        handleChordNotesChange,
        handleDeleteSelectedChord,
        handleNoteSelectedChange,
    } = useChords(
        song,
        selectedBarId,
        selectedChordId,
        selectedChordPosition,
        chordMenuOptions,
        dispatchChordMenuOptions,
        dispatchSong,
        setValuesForSelectedChord
    )

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight)
    }

    const handleAddBar = async () => {
        const { error, result } = await postBar.run()
        if (!error && result) {
            dispatchSong({ type: "UPDATE_SONG", song: result.data })
            scrollToBottom()
        }
    }
    let timeSignatureNumerator = numerator
    if (denominator === 4) timeSignatureNumerator *= 2

    const clickOutsideListener = (e: any) => {
        if (
            e.target.id !== "chordButton" &&
            e.target.id !== "singleChord" &&
            ((chordOptionsRef.current &&
                !chordOptionsRef.current.contains(e.target)) ||
                !chordOptionsRef.current)
        ) {
            setValuesForSelectedChord(undefined, undefined, 0)
        }
    }

    const Menu = (
        <FormControl
            variant="outlined"
            size={"small"}
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                pl: 1,
                border: 0,
                "& .MuiOutlinedInput-notchedOutline": { border: "0px" },
                width: "100px",
            }}
        >
            <label id="selectChordLengthLabel" hidden>
                {t("BottomBar.noteLength")}
            </label>
            <Select
                labelId={"selectChordLengthLabel"}
                id={"selectChordLength"}
                fullWidth
                value={chordMenuOptions?.chordLength}
                onChange={(event) => {
                    handleChangeChordLength(event.target.value as number)
                }}
            >
                {noteLengths
                    .filter(({ length }) => length < timeSignatureNumerator)
                    .map(({ length, Icon, label }) => {
                        return (
                            <MenuItem
                                value={length}
                                key={length}
                                aria-label={t(label)}
                            >
                                <SvgIcon>{Icon}</SvgIcon>
                            </MenuItem>
                        )
                    })}
            </Select>
        </FormControl>
    )

    const handleToggle = (
        event: React.MouseEvent<HTMLElement>,
        chordType: ChordType | null
    ) => {
        if (chordType) {
            handleNoteSelectedChange(chordType)
        }
    }

    return (
        <ClickAwayListener onClickAway={clickOutsideListener}>
            <Box
                sx={{
                    width: "100%",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    pl: 3,
                    pr: 3,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >
                <Paper
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        m: 1,
                        flexGrow: 0,
                    }}
                    elevation={6}
                >
                    {Menu}
                    <DropdownAutocomplete
                        selectedChordType={chordMenuOptions?.chordType}
                        selectedChord={chordMenuOptions?.chord}
                        onChordChange={handleChangeChord}
                    />
                    <ToggleButtonGroup
                        sx={{ borderRadius: 0 }}
                        value={chordMenuOptions?.chordType}
                        exclusive
                        onChange={handleToggle}
                        size={"large"}
                    >
                        <ToggleButton
                            sx={{ border: 0, borderRadius: 0 }}
                            value={ChordType.CHORD}
                            disableFocusRipple
                            className={classes.focusElement}
                        >
                            {t("BottomBar.chord")}
                        </ToggleButton>
                        <ToggleButton
                            sx={{ border: 0, borderRadius: 0 }}
                            value={ChordType.NOTE}
                            disableFocusRipple
                            className={classes.focusElement}
                        >
                            {t("BottomBar.note")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                        disableFocusRipple
                        onClick={handleDeleteSelectedChord}
                        aria-label={t("BottomBar.deleteSelectedChord")}
                    >
                        <Delete />
                    </Button>
                </Paper>

                <SelectedChordIntervals />
                <MenuButtonWithAddIcon
                    text={t("BottomBar.addBar")}
                    onClick={handleAddBar}
                />
            </Box>
        </ClickAwayListener>
    )
}
