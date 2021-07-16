import React, { useState } from "react"
import {
    Box,
    ButtonBase,
    Checkbox,
    FormControlLabel,
    Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { IChord } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { tangentToNumber } from "../../utils/bar.util"
import {
    useCreateChord,
    useAddBar,
    useUpdateChord,
    useAddNote,
} from "../../utils/useApiServiceSongs"
import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { useChords } from "../../utils/useChords"
import { getNotesFromChord } from "../../models/chords"
import { ChordType } from "../../models/IChordMenuOptions"
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded"
import RadioButtonUncheckedRoundedIcon from "@material-ui/icons/RadioButtonUncheckedRounded"

type ChordProps = {
    chord: IChord
    barPosition: number
    onContextMenu: (event: React.MouseEvent) => void
    onClick: (event: React.MouseEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    highlight: boolean
    exportMode: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    isSelected: boolean
    handleChordFocus: () => void
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | null | undefined
    barEditMode: boolean
    barId: number
}

const useStyle = makeStyles((theme) => ({
    buttonBase: {
        borderRadius: "3px",
        "&:hover": {
            filter: `brightness(80%)`,
        },
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    },
    emptyChordContainer: {
        borderRadius: "3px",
        "&:hover": {
            filter: `brightness(100%)`,
        },
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    },
    exportNumberSize: {
        ...theme.typography.body1,
        "@media(max-width:600px)": {},
        fontSize: "1.25rem",
    },
    noteContainer: {
        marginTop: "1px",
        borderColor: "rgb(0 0 0 / 12%)",
        borderRadius: "3px",
        display: "flex",
        flex: "1",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        border: "1px solid",
    },
    noteFont: {
        ...theme.typography.body1,
        "@media(max-width:600px)": {},
    },
    circleIconChecked: {
        color: colors.focus,
        fontSize: "1.25rem",
        marginRight: "0.1rem",
    },
    circleIconUnChecked: {
        color: colors.gray_400,
        fontSize: "1.25rem",
        marginRight: "0.1rem",
    },
    C: {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.C.main },
        "&.opaque": { backgroundColor: colors.C.opaque },
    },
    D: {
        color: colors.D.text,
        "&.main": { backgroundColor: colors.D.main },
        "&.opaque": { backgroundColor: colors.D.opaque },
    },
    E: {
        color: colors.E.text,
        "&.main": { backgroundColor: colors.E.main },
        "&.opaque": { backgroundColor: colors.E.opaque },
    },
    F: {
        color: colors.F.text,
        "&.main": { backgroundColor: colors.F.main },
        "&.opaque": { backgroundColor: colors.F.opaque },
    },
    G: {
        color: colors.G.text,
        "&.main": { backgroundColor: colors.G.main },
        "&.opaque": { backgroundColor: colors.G.opaque },
    },
    A: {
        color: colors.A.text,
        "&.main": { backgroundColor: colors.A.main },
        "&.opaque": { backgroundColor: colors.A.opaque },
    },
    H: {
        color: colors.H.text,
        "&.main": { backgroundColor: colors.H.main },
        "&.opaque": { backgroundColor: colors.H.opaque },
    },
    "C#": {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.gray_500 },
        "&.opaque": { backgroundColor: colors.gray_300 },
    },
    "D#": {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.gray_500 },
        "&.opaque": { backgroundColor: colors.gray_300 },
    },
    "F#": {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.gray_500 },
        "&.opaque": { backgroundColor: colors.gray_300 },
    },
    "G#": {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.gray_500 },
        "&.opaque": { backgroundColor: colors.gray_300 },
    },
    "A#": {
        color: colors.C.text,
        "&.main": { backgroundColor: colors.gray_500 },
        "&.opaque": { backgroundColor: colors.gray_300 },
    },
    unselected: {
        // opacity: "0.1",
    },
    disabled: {
        border: 0,
    },
    highlight: {
        backgroundColor: colors.focus,
        filter: `brightness(100%)`,
    },
    selected: {
        boxShadow: `0 0 0 4px ${colors.focus}`,
    },
}))

const ChordText = (props: { chordName: string }) => {
    return (
        <Typography
            style={{
                zIndex: 0,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
                color: "#555555",
            }}
        >
            {`${props.chordName} `}
        </Typography>
    )
}

export const Chord = (props: ChordProps) => {
    const {
        chord: chord,
        barPosition,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        getChordNameFromMainVoice,
        highlight,
        exportMode,
        showChordLetters,
        showNoteLetters,
        isSelected,
        handleChordFocus,
        barEditMode,
        barId,
    } = props
    const classes = useStyle()

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)

    const {
        song,
        selectedVoiceId,
        selectedBarId,
        selectedChordId,
        dispatchSong,
        dispatchChordMenuOptions,
        setValuesForSelectedChord,
    } = useSongContext()

    const [customVoiceNoteStates, setCustomVoiceNoteStates] = useState<
        Boolean[]
    >(chord.notes.map(() => false))

    const [customMode, setCustomMode] = useState(true)

    const { addNote } = useAddNote(
        song.songId.toString(),
        selectedVoiceId,
        barPosition
    )

    const handleCustomVoiceAddClick = async (index: number) => {
        const { error, result } = await addNote.run({
            chordName: chord.chordName,
            notePosition: chord.position,
            length: chord.length,
            intervalPosition: index,
        })

        const newCustomVoiceNoteStates = { ...customVoiceNoteStates }
        newCustomVoiceNoteStates[index] = !newCustomVoiceNoteStates[index]
        setCustomVoiceNoteStates(newCustomVoiceNoteStates)

        /* if (true !error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            dispatchChordMenuOptions({
                type: "UPDATE_OPTIONS",
                menuOptions: {
                    chordLength: chord.length,
                    chord: chord.chordName,
                    chordType: chordType,
                    chordNotes: notes as string[],
                },
            })
            setValuesForSelectedChord(
                selectedChordId,
                result.data.barId,
                chord.position
            )
            const newCustomVoiceNoteStates = { ...customVoiceNoteStates }
            newCustomVoiceNoteStates[index] = !newCustomVoiceNoteStates[index]
            setCustomVoiceNoteStates(newCustomVoiceNoteStates)
        } */
    }

    return (
        <Box
            flexGrow={chord.length}
            display="flex"
            flexDirection="column"
            position="relative"
            height="100%"
            justifyContent="flex-end"
            flexBasis="0"
            mr={0.5}
            ml={0.5}
            minWidth={0}
        >
            {chordName && showChordLetters && (
                <ChordText chordName={chordName} />
            )}
            {customMode ? (
                <Box
                    /* id="chordButton"
                    disabled={exportMode}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    disableRipple={barEditMode}
                    className={`${
                        barEditMode
                            ? ""
                            : chord.notes[0] === "Z"
                            ? classes.emptyChordContainer
                            : classes.buttonBase
                    } ${isSelected ? classes.selected : ""}`}
                    focusVisibleClassName={classes.buttonBase}
                    
                    onFocus={handleChordFocus} */
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100% - 25px)",
                        width: "100%",
                        minWidth: 0,
                        alignItems: "stretch",
                    }}
                >
                    {chord.notes
                        .map((note, i) => {
                            const tangent = tangentToNumber(note)
                            return (
                                <>
                                    <ButtonBase
                                        id="singleChord"
                                        className={`${classes.noteContainer} 
                                        ${(classes as any)[note]} ${
                                            customMode
                                                ? customVoiceNoteStates[i]
                                                    ? "main"
                                                    : "opaque"
                                                : "main"
                                        }
                                        } ${exportMode ? "disabled" : ""} ${
                                            note === "Z" && highlight
                                                ? classes.highlight
                                                : ""
                                        } ${
                                            Number(tangent) && exportMode
                                                ? classes.exportNumberSize
                                                : classes.noteFont
                                        } ${
                                            customVoiceNoteStates[i]
                                                ? ""
                                                : classes.unselected
                                        }  `}
                                        key={note + i}
                                        onClick={() =>
                                            handleCustomVoiceAddClick(i)
                                        }
                                    >
                                        {note[0] !== "Z" ? (
                                            customVoiceNoteStates[i] ? (
                                                <CheckCircleRoundedIcon
                                                    className={
                                                        classes.circleIconChecked
                                                    }
                                                />
                                            ) : (
                                                <RadioButtonUncheckedRoundedIcon
                                                    className={
                                                        classes.circleIconUnChecked
                                                    }
                                                />
                                            )
                                        ) : (
                                            ""
                                        )}
                                        {showNoteLetters || Number(tangent)
                                            ? tangent
                                            : undefined}
                                    </ButtonBase>
                                </>
                            )
                        })
                        .reverse()}
                </Box>
            ) : (
                <ButtonBase
                    id="chordButton"
                    disabled={exportMode}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    disableRipple={barEditMode}
                    className={`${
                        barEditMode
                            ? ""
                            : chord.notes[0] === "Z"
                            ? classes.emptyChordContainer
                            : classes.buttonBase
                    } ${isSelected ? classes.selected : ""}`}
                    focusVisibleClassName={classes.buttonBase}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "calc(100% - 25px)",
                        width: "100%",
                        minWidth: 0,
                        alignItems: "stretch",
                    }}
                    onFocus={handleChordFocus}
                >
                    {chord.notes
                        .map((note, i) => {
                            const tangent = tangentToNumber(note)
                            return (
                                <>
                                    <div
                                        id="singleChord"
                                        className={`${classes.noteContainer} ${
                                            (classes as any)[note]
                                        } ${exportMode ? "disabled" : ""} ${
                                            note === "Z" && highlight
                                                ? classes.highlight
                                                : ""
                                        } ${
                                            Number(tangent) && exportMode
                                                ? classes.exportNumberSize
                                                : classes.noteFont
                                        }`}
                                        key={note + i}
                                    >
                                        {showNoteLetters || Number(tangent)
                                            ? tangent
                                            : undefined}
                                    </div>
                                </>
                            )
                        })
                        .reverse()}
                </ButtonBase>
            )}
        </Box>
    )
}
