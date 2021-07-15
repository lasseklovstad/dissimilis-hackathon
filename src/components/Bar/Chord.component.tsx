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
import { useAddBar, useUpdateChord } from "../../utils/useApiServiceSongs"
import { Song } from "../Song/Song.component"

type ChordProps = {
    chords: IChord
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
    songId: number
    voiceId: number
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
    C: {
        backgroundColor: colors.C.main,
        color: colors.C.text,
    },
    D: {
        backgroundColor: colors.D.main,
        color: colors.D.text,
    },
    E: {
        backgroundColor: colors.E.main,
        color: colors.E.text,
    },
    F: {
        backgroundColor: colors.F.main,
        color: colors.F.text,
    },
    G: {
        backgroundColor: colors.G.main,
        color: colors.G.text,
    },
    A: {
        backgroundColor: colors.A.main,
        color: colors.A.text,
    },
    H: {
        backgroundColor: colors.H.main,
        color: colors.H.text,
    },
    "C#": {
        backgroundColor: colors.gray_500,
    },
    "D#": {
        backgroundColor: colors.gray_500,
    },
    "F#": {
        backgroundColor: colors.gray_500,
    },
    "G#": {
        backgroundColor: colors.gray_500,
    },
    "A#": {
        backgroundColor: colors.gray_500,
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
        chords: chord,
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
    } = props
    const classes = useStyle()

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)

    const [customVoiceNoteStates, setCustomVoiceNoteStates] = useState<
        Boolean[]
    >(chord.notes.map(() => false))

    const [customMode, setCustomMode] = useState(true)

    /*      const { updateChord } = useUpdateChord(
        songId.toString(),
        voiceId,
        selectedBarId,
        selectedChordId
    ) */

    /*     const handleCustomVoiceAddClick = async (index: number) => {
        console.log("click")
            const { error, result } = await updateChord.run({
                positin: chord.position,
                length: chord.length,
                notes: chord.notes,
                chordName: chord.chordName,
            })
            console.log(index)
            console.log("HEEER", result)
            if (!error && result) {
                const newCustomVoiceNoteStates = { ...customVoiceNoteStates }
                newCustomVoiceNoteStates[index] =
                    !newCustomVoiceNoteStates[index]
                setCustomVoiceNoteStates(newCustomVoiceNoteStates)
            }
            return
        }
    } */

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
                            : chords.notes[0] === "Z"
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
                                        onClick={() =>
                                            console.log("hola seniour")
                                        }
                                    >
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
