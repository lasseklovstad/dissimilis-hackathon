import React from "react"
import { Box, ButtonBase, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { IChord, IBar } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { tangentToNumber } from "../../utils/bar.util"

type ChordProps = {
    chords: IChord
    bar: IBar
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
    getMainVoiceChordName: (bar: IBar, chord: IChord) => string | undefined
    barEditMode: boolean
}

const useStyle = makeStyles(() => ({
    buttonBase: {
        "&:hover": {
            filter: `brightness(80%)`,
        },
        "&:focus": {
            outline: `4px solid ${colors.focus}`,
        },
    },
    emptyChordContainer: {
        "&:hover": {
            filter: `brightness(100%)`,
        },
        "&:focus": {
            outline: `4px solid ${colors.focus}`,
        },
    },
    exportNumberSize: {
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
    C: {
        backgroundColor: colors.C.main,
    },
    D: {
        backgroundColor: colors.D.main,
    },
    E: {
        backgroundColor: colors.E.main,
    },
    F: {
        backgroundColor: colors.F.main,
    },
    G: {
        backgroundColor: colors.G.main,
    },
    A: {
        backgroundColor: colors.A.main,
    },
    H: {
        backgroundColor: colors.H.main,
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
        outline: `4px solid ${colors.focus}`,
    },
}))

const ChordText = (props: { chordName: string }) => {
    return (
        <Typography
            variant="body1"
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
        chords,
        bar,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        getMainVoiceChordName,
        highlight,
        exportMode,
        showChordLetters,
        showNoteLetters,
        isSelected,
        handleChordFocus,
        barEditMode,
    } = props
    const classes = useStyle()

    const chordName = getMainVoiceChordName(bar, chords)

    return (
        <Box
            flexGrow={chords.length}
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
                        : chords.notes[0] === "Z"
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
                {chords.notes
                    .map((note, i) => {
                        const tangent = tangentToNumber(note)
                        return (
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
                                        : undefined
                                }`}
                                key={note + i}
                            >
                                {showNoteLetters || Number(tangent)
                                    ? tangent
                                    : undefined}
                            </div>
                        )
                    })
                    .reverse()}
            </ButtonBase>
        </Box>
    )
}
