import React, { RefObject } from "react"
import { Box, ButtonBase, createMuiTheme, Typography, useTheme } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { IChordAndNotes } from "../../models/IBar"
import { colors } from "../../utils/colors"
import { getChord, getColor, tangentToNumber } from "../../utils/bar.util"

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
    onChordFocus: () => void
}

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

const useStyle = makeStyles(() => ({
    buttonBase: {
        "&:focus": {
            outline: `4px solid ${colors.focus}`,
        },
    }
}))

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
        onChordFocus,
    } = props
    const classes = useStyle()
    const isChord = chordsAndNotes.notes.length > 2

    const {
        palette: {
            getContrastText,
        }
    } = useTheme()

    const getBackgroundColor = (note: string) => {
        if (highlight && note === "Z") {
            return colors.focus
        }
        return getColor(note, highlight)
    }

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
                onFocus={onChordFocus}
                onContextMenu={onContextMenu}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={classes.buttonBase}
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
                        const text = tangentToNumber(note)
                        const bgcolor = getBackgroundColor(note)
                        const color = bgcolor
                            ? getContrastText(bgcolor)
                            : "#000000"
                        return (
                            <Box
                                key={note + i}
                                bgcolor={bgcolor}
                                color={color}
                                mt="1px"
                                borderColor="divider"
                                borderRadius={3}
                                border={disabled ? 0 : 1}
                                display="flex"
                                flex={1}
                                justifyContent="center"
                                alignItems="center"
                            >
                                {text}
                            </Box>
                        )
                    })
                    .reverse()}
            </ButtonBase>
        </Box>
    )
}
