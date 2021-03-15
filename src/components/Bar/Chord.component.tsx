import React, { RefObject } from "react"
import { Box, ButtonBase, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { IChordAndNotes } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { getChord, tangentToNumber } from "../../utils/bar.util"

type ChordProps = {
    chordsAndNotes: IChordAndNotes
    onContextMenu: (event: React.MouseEvent) => void
    onClick: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    highlight: boolean
    disabled: boolean
    showChordLetters: boolean
    refHighlightedNote: RefObject<HTMLAnchorElement> | undefined
    isSelected: boolean
    // onChordFocus: () => void
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

const ChordText = (props: { notes: string[] }) => {
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
            {`${getChord(props.notes)} `}
        </Typography>
    )
}

export const Chord = (props: ChordProps) => {
    const {
        chordsAndNotes,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        // Active chord
        highlight,
        disabled,
        showChordLetters,
        refHighlightedNote,
        isSelected,
        // onChordFocus,
    } = props
    const classes = useStyle()
    const isChord = chordsAndNotes.notes.length > 2

    // const {
    //     palette: { getContrastText },
    // } = useTheme()

    // const getBackgroundColor = (note: string) => {
    //     if (highlight && note === "Z") {
    //         return colors.focus
    //     }
    //     return getColor(note)
    // }

    return (
        <Box
            flexGrow={chordsAndNotes.length}
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
            {isChord && showChordLetters && (
                <ChordText notes={chordsAndNotes.notes} />
            )}
            <ButtonBase
                disabled={disabled}
                onClick={onClick}
                // onFocus={onChordFocus}
                onContextMenu={onContextMenu}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={`${
                    chordsAndNotes.notes[0] === "Z"
                        ? classes.emptyChordContainer
                        : classes.buttonBase
                } ${isSelected ? classes.selected : ""}`}
                focusVisibleClassName={classes.buttonBase}
                innerRef={isSelected ? refHighlightedNote : undefined}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 25px)",
                    width: "100%",
                    minWidth: 0,
                    alignItems: "stretch",
                }}
            >
                {chordsAndNotes.notes
                    .map((note, i) => {
                        // const text = tangentToNumber(note)
                        // const bgcolor = getBackgroundColor(note)
                        // const color = bgcolor
                        //     ? getContrastText(bgcolor)
                        //     : "#000000"
                        return (
                            <div
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
                            // <Box
                            //     key={note + i}
                            //     bgcolor={bgcolor}
                            //     color={color}
                            //     mt="1px"
                            //     borderColor="divider"
                            //     borderRadius={3}
                            //     border={disabled ? 0 : 1}
                            //     display="flex"
                            //     flex={1}
                            //     justifyContent="center"
                            //     alignItems="center"
                            // >
                            //     {text}
                            // </Box>
                        )
                    })
                    .reverse()}
            </ButtonBase>
        </Box>
    )
}
