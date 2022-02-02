import React, { useEffect, useState } from "react"
import { Box, ButtonBase, Typography } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { IChord } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { tangentToNumber } from "../../utils/bar.util"
import { useAddNote, useRemoveNote } from "../../utils/useApiServiceSongs"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded"
import { useVoice } from "../../utils/useVoice"

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
    noteContainerCustomMode: {
        marginTop: "1px",
        borderRadius: "3px",
        display: "flex",
        flex: "1",
        justifyContent: "center",
        alignItems: "center",
        color: "white",

        boxShadow: `inset 0px 0px 0px 1px ${colors.gray_200}`,
    },
    noteFont: {
        ...theme.typography.body1,
        "@media(max-width:600px)": {
            fontSize: "0.95rem",
        },
    },
    circleIconChecked: {
        color: colors.black,
        fontSize: "1.25rem",
        marginRight: "0.15rem",
        "@media(max-width:768px)": {
            fontSize: "0.9rem",
            marginRight: "0.05rem",
        },
    },
    circleIconUnChecked: {
        color: colors.gray_400,
        fontSize: "1.25rem",
        marginRight: "0.15rem",
        verticalAlign: "middle",
        "@media(max-width:768px)": {
            fontSize: "0.9rem",
            marginRight: "0.05rem",
        },
    },
    C: {
        color: colors.C.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.C.main}`,
        "&.main": { backgroundColor: colors.C.main },
        "&.opaque": {
            backgroundColor: colors.C.opaque,
            boxShadow: `inset 0px 0px 0px 2px ${colors.C.main}`,
        },
    },
    D: {
        color: colors.D.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.D.main}`,
        "&.main": { backgroundColor: colors.D.main },
        "&.opaque": {
            backgroundColor: colors.D.opaque,
            color: colors.D.text,
        },
    },
    E: {
        color: colors.E.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.E.main}`,
        "&.main": { backgroundColor: colors.E.main },
        "&.opaque": {
            backgroundColor: colors.E.opaque,
            color: colors.black,
        },
    },
    F: {
        color: colors.F.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.F.main}`,
        "&.main": { backgroundColor: colors.F.main },
        "&.opaque": {
            backgroundColor: colors.F.opaque,
        },
    },
    G: {
        color: colors.G.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.G.main}`,
        "&.main": { backgroundColor: colors.G.main },
        "&.opaque": {
            backgroundColor: colors.G.opaque,
        },
    },
    A: {
        color: colors.A.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.A.main}`,
        "&.main": { backgroundColor: colors.A.main },
        "&.opaque": {
            backgroundColor: colors.A.opaque,
            color: colors.black,
        },
    },
    H: {
        color: colors.H.text,
        boxShadow: `inset 0px 0px 0px 2px ${colors.H.main}`,
        "&.main": { backgroundColor: colors.H.main },
        "&.opaque": {
            backgroundColor: colors.H.opaque,
        },
    },
    "C#": {
        boxShadow: `inset 0px 0px 0px 2px ${colors.blackKeys.main}`,
        "&.main": { backgroundColor: colors.blackKeys.main },
        "&.opaque": {
            backgroundColor: colors.blackKeys.opaque,
            color: colors.black,
        },
    },
    "D#": {
        boxShadow: `inset 0px 0px 0px 2px ${colors.blackKeys.main}`,
        "&.main": { backgroundColor: colors.blackKeys.main },
        "&.opaque": {
            backgroundColor: colors.blackKeys.opaque,
            color: colors.black,
        },
    },
    "F#": {
        boxShadow: `inset 0px 0px 0px 2px ${colors.blackKeys.main}`,
        "&.main": { backgroundColor: colors.blackKeys.main },
        "&.opaque": {
            backgroundColor: colors.blackKeys.opaque,
            color: colors.black,
        },
    },
    "G#": {
        boxShadow: `inset 0px 0px 0px 2px ${colors.blackKeys.main}`,
        "&.main": { backgroundColor: colors.blackKeys.main },
        "&.opaque": {
            backgroundColor: colors.blackKeys.opaque,
            color: colors.black,
        },
    },
    "A#": {
        boxShadow: `inset 0px 0px 0px 2px ${colors.blackKeys.main}`,
        "&.main": { backgroundColor: colors.blackKeys.main },
        "&.opaque": {
            backgroundColor: colors.blackKeys.opaque,
            color: colors.black,
        },
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
    buttonBox: {
        display: "flex",
        flexDirection: "column",
        height: "calc(100% - 25px)",
        width: "100%",
        minWidth: 0,
        alignItems: "stretch",
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

type ChordProps = {
    updatedNoteValues?: boolean[]
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
    onTouchEnd: () => void
}

export const Chord = (props: ChordProps) => {
    const {
        updatedNoteValues,
        chord,
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
        onTouchEnd,
    } = props
    const classes = useStyle()

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)

    const { song, dispatchSong } = useSongContext()
    const selectedVoice = useVoice(song?.voices)

    const [customVoiceNoteStates, setCustomVoiceNoteStates] = useState<
        boolean[]
    >(chord.notes.map(() => false))

    const { customMode } = useSongContext()

    const { addNote } = useAddNote(
        song?.songId,
        selectedVoice?.songVoiceId,
        barPosition
    )

    const handleCustomVoiceAddClick = async (index: number) => {
        const { error, result } = await addNote.run({
            chordName: chord.chordName,
            notePosition: chord.position,
            length: chord.length,
            intervalPosition: index,
            notes: chord.notes,
        })
        if (!error && result) {
            const newCustomVoiceNoteStates = { ...customVoiceNoteStates }
            newCustomVoiceNoteStates[index] = true
            setCustomVoiceNoteStates(newCustomVoiceNoteStates)
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        }
    }
    useEffect(() => {
        if (updatedNoteValues) {
            setCustomVoiceNoteStates(updatedNoteValues)
        }
    }, [updatedNoteValues])

    const { removeNote } = useRemoveNote(
        song?.songId,
        selectedVoice?.songVoiceId,
        barPosition
    )
    const handleCustomVoiceRemoveClick = async (index: number) => {
        const { error, result } = await removeNote.run({
            deleteOnLastIntervalRemoved: true,
            chordName: chord.chordName,
            notePosition: chord.position,
            length: chord.length,
            intervalPosition: index,
            notes: chord.notes,
        })
        if (!error && result) {
            const newCustomVoiceNoteStates = { ...customVoiceNoteStates }
            newCustomVoiceNoteStates[index] = false
            setCustomVoiceNoteStates(newCustomVoiceNoteStates)
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        }
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
                <Box className={classes.buttonBox}>
                    {chord.notes
                        .filter((note) => note !== "X")
                        .map((note, i) => {
                            const tangent = tangentToNumber(note)
                            return (
                                <ButtonBase
                                    id="singleChord"
                                    className={`${
                                        classes.noteContainerCustomMode
                                    } 
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
                                    }`}
                                    key={note}
                                    onClick={() =>
                                        customVoiceNoteStates[i]
                                            ? handleCustomVoiceRemoveClick(i)
                                            : handleCustomVoiceAddClick(i)
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
                                    {(showNoteLetters || Number(tangent)) &&
                                        tangent}
                                </ButtonBase>
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
                    onTouchEnd={onTouchEnd}
                    disableRipple={barEditMode}
                    className={`${classes.buttonBox} ${
                        barEditMode
                            ? ""
                            : chord.notes[0] === "Z"
                            ? classes.emptyChordContainer
                            : classes.buttonBase
                    } ${isSelected ? classes.selected : ""}`}
                    focusVisibleClassName={classes.buttonBase}
                    onFocus={handleChordFocus}
                >
                    {chord.notes
                        .map((note) => {
                            const tangent = tangentToNumber(note)
                            return (
                                note !== "X" && (
                                    <div
                                        id="singleChord"
                                        className={`${classes.noteContainer} ${
                                            (classes as any)[note]
                                        } ${"main"} ${
                                            exportMode ? "disabled" : ""
                                        } ${
                                            note === "Z" && highlight
                                                ? classes.highlight
                                                : ""
                                        } ${
                                            Number(tangent) && exportMode
                                                ? classes.exportNumberSize
                                                : classes.noteFont
                                        }`}
                                        key={note}
                                    >
                                        {(showNoteLetters || Number(tangent)) &&
                                            tangent}
                                    </div>
                                )
                            )
                        })
                        .reverse()}
                </ButtonBase>
            )}
        </Box>
    )
}
