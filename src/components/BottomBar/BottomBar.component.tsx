import React, { RefObject, useContext } from "react"
import {
    Button,
    ClickAwayListener,
    FormControl,
    Grid,
    makeStyles,
    MenuItem,
    RootRef,
    Select,
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
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import { ISong } from "../../models/ISong"

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
    },
    {
        length: 6,
        Icon: <HalfnoteDottedIcon />,
    },
    {
        length: 4,
        Icon: <HalfnoteIcon />,
    },
    {
        length: 3,
        Icon: <QuarternoteDottedIcon />,
    },
    {
        length: 2,
        Icon: <QuarternoteIcon />,
    },
    {
        length: 1,
        Icon: <EighthnoteIcon />,
    },
]

export const BottomBar = (props: {
    timeSignature: { numerator: number; denominator: number }
    addBar: (song: ISong) => void
    songId: string
    voiceId: number
    onChordChange: (chord: string) => void
    onChordLengthChange: (length: number) => void
    onNoteSelectedChange: (chordType: ChordType) => void
    chordDropdownContent: string[]
    deleteSelectedChord: () => void
    clickOutsideListener: (e: any) => void
    onChordNotesChange: (clickedNote: string, checked: boolean) => void
    chordOptionsRef: RefObject<any>
}) => {
    const {
        timeSignature: { numerator, denominator },
        addBar,
        voiceId,
        songId,
        onChordChange,
        onChordLengthChange,
        onNoteSelectedChange,
        chordDropdownContent,
        clickOutsideListener,
        deleteSelectedChord,
        onChordNotesChange,
        chordOptionsRef,
    } = props
    const { t } = useTranslation()
    const classes = useStyles()
    const { chordMenuOptions, selectedChordId } = useContext(SongContext)

    const { postBar } = useAddBar(songId, voiceId)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        onChordLengthChange(event.target.value as number)
    }

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight)
    }

    const handleAddBar = async () => {
        const { error, result } = await postBar.run()
        if (!error && result) {
            addBar(result.data)
            scrollToBottom()
        }
    }
    let timeSignatureNumerator = numerator
    if (denominator === 4) timeSignatureNumerator *= 2

    const Menu = (
        <FormControl
            variant="outlined"
            fullWidth
            classes={{ root: classes.removeDefaultStyling }}
        >
            <Select
                value={chordMenuOptions.chordLength}
                onChange={handleChange}
                inputProps={{ className: classes.input }}
                classes={{ icon: classes.selectIcon }}
                MenuProps={{ disablePortal: true }}
            >
                {noteLengths.map(({ length, Icon }) => {
                    return (
                        <MenuItem
                            value={length}
                            key={length}
                            style={{
                                display:
                                    timeSignatureNumerator < length
                                        ? "none"
                                        : "block",
                            }}
                        >
                            {Icon}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )

    const handleToggle = (
        event: React.MouseEvent<HTMLElement>,
        chordType: ChordType
    ) => {
        onNoteSelectedChange(chordType)
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
                                        chordMenuOptions.chordType
                                    }
                                    selectedChord={chordMenuOptions.chord}
                                    onChordChange={onChordChange}
                                    icon={<MusicNoteIcon fontSize="small" />}
                                    chordDropdownContent={chordDropdownContent}
                                    noOptionsText={t("BottomBar.noOptions")}
                                />
                            </div>
                            <StyledToggleButtonGroup
                                value={chordMenuOptions.chordType}
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
                                onClick={deleteSelectedChord}
                            >
                                <Delete />
                            </Button>
                        </div>
                    </ClickAwayListener>

                    {chordMenuOptions.chordType === ChordType.CHORD &&
                    selectedChordId ? (
                        <RootRef rootRef={chordOptionsRef}>
                            <div className={classes.container}>
                                <ChordOptions
                                    chord={chordMenuOptions.chord}
                                    onChordNotesChange={onChordNotesChange}
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
