import React, { RefObject, useRef } from "react"
import {
    Button,
    ClickAwayListener,
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    RootRef,
    Select,
    SvgIcon,
    Typography,
    withStyles,
} from "@material-ui/core"
import MusicNoteIcon from "@material-ui/icons/MusicNote"
import { Delete } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
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
    positioningContainer: {
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        marginBottom: "24px",
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

export const BottomBar = (props: {
    voiceId: number
    chordDropdownContent: string[]
    chordOptionsRef: RefObject<any>
}) => {
    const { voiceId, chordDropdownContent, chordOptionsRef } = props
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
    const container = useRef(null)
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
            fullWidth
            classes={{ root: classes.removeDefaultStyling }}
        >
            <div ref={container} />
            <label id="selectChordLengthLabel" hidden>
                {t("BottomBar.noteLength")}
            </label>
            <Select
                labelId={"selectChordLengthLabel"}
                id={"selectChordLength"}
                value={chordMenuOptions?.chordLength}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    handleChangeChordLength(event.target.value as number)
                }}
                inputProps={{ className: classes.input }}
                classes={{ icon: classes.selectIcon }}
                MenuProps={{ container: container.current }}
            >
                {noteLengths.map(({ length, Icon, label }) => {
                    return (
                        <MenuItem
                            value={length}
                            key={length}
                            aria-label={t(label)}
                            style={{
                                display:
                                    timeSignatureNumerator < length
                                        ? "none"
                                        : "block",
                            }}
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
        <Grid container className={`mui-fixed ${classes.positioningContainer}`}>
            <Grid container justify="center">
                <Grid item xs={12} sm={10} className={classes.outercontainer}>
                    <ClickAwayListener onClickAway={clickOutsideListener}>
                        <div className={classes.container}>
                            <div className={classes.flexelement}>{Menu}</div>
                            <div className={classes.flexelement}>
                                <DropdownAutocomplete
                                    selectedChordType={
                                        chordMenuOptions?.chordType
                                    }
                                    selectedChord={chordMenuOptions?.chord}
                                    onChordChange={handleChangeChord}
                                    icon={<MusicNoteIcon fontSize="small" />}
                                    chordDropdownContent={chordDropdownContent}
                                    noOptionsText={t("BottomBar.noOptions")}
                                />
                            </div>
                            <StyledToggleButtonGroup
                                value={chordMenuOptions?.chordType}
                                exclusive
                                onChange={handleToggle}
                                className={classes.flexelement}
                                size="small"
                            >
                                <ToggleButton
                                    value={ChordType.CHORD}
                                    disableFocusRipple
                                    className={classes.focusElement}
                                >
                                    <Typography>
                                        {t("BottomBar.chord")}
                                    </Typography>
                                </ToggleButton>
                                <ToggleButton
                                    value={ChordType.NOTE}
                                    disableFocusRipple
                                    className={classes.focusElement}
                                >
                                    <Typography>
                                        {t("BottomBar.note")}
                                    </Typography>
                                </ToggleButton>
                            </StyledToggleButtonGroup>
                            <Button
                                disableFocusRipple
                                onClick={handleDeleteSelectedChord}
                                aria-label={t("BottomBar.deleteSelectedChord")}
                            >
                                <Delete />
                            </Button>
                        </div>
                    </ClickAwayListener>

                    {chordMenuOptions?.chordType === ChordType.CHORD &&
                    selectedChordId ? (
                        <RootRef rootRef={chordOptionsRef}>
                            <div className={classes.container}>
                                <ChordOptions
                                    chord={chordMenuOptions?.chord}
                                    onChordNotesChange={handleChordNotesChange}
                                />
                            </div>
                        </RootRef>
                    ) : undefined}
                    <div className={classes.container}>
                        <MenuButtonWithAddIcon
                            text={t("BottomBar.addBar")}
                            onClick={handleAddBar}
                        />
                    </div>
                </Grid>
            </Grid>
        </Grid>
    )
}
