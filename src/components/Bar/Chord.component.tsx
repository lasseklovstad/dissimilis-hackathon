import React from "react"
import { Box, ButtonBase, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { IChord } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { tangentToNumber } from "../../utils/bar.util"

type ChordProps = {
    chords: IChord
    onContextMenu: (event: React.MouseEvent) => void
    onClick: (event: React.MouseEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    highlight: boolean
    disabled: boolean
    showChordLetters: boolean
    isSelected: boolean
    handleChordFocus: () => void
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

const ChordText = (props: { activeChord: string }) => {
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
            {`${props.activeChord} `}
        </Typography>
    )
}

export const Chord = (props: ChordProps) => {
    const {
        chords,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        highlight,
        disabled,
        showChordLetters,
        isSelected,
        handleChordFocus,
    } = props
    const classes = useStyle()

    return (
        <Box
            flexGrow={chords.length}
            display="flex"
            flexDirection="column"
            position="relative"
            height="calc(100% + 25px)"
            justifyContent="flex-end"
            top="-25px"
            flexBasis="0"
            mr={1}
            minWidth={0}
        >
            {chords.activeChord && showChordLetters && (
                <ChordText activeChord={chords.activeChord} />
            )}
            <ButtonBase
                id="chordButton"
                disabled={disabled}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={`${
                    chords.notes[0] === "Z"
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
                        return (
                            <div
                                id="singleChord"
                                className={`${classes.noteContainer} ${
                                    (classes as any)[note]
                                } ${disabled ? "disabled" : ""} ${
                                    note === "Z" && highlight
                                        ? classes.highlight
                                        : ""
                                }`}
                                key={note + i}
                            >
                                {tangentToNumber(note)}
                            </div>
                        )
                    })
                    .reverse()}
            </ButtonBase>
        </Box>
    )
}
