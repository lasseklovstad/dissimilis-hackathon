import React from "react"
import { Box, ButtonBase, Paper, Typography } from "@material-ui/core"
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
}

const ChordText = (props: { notes: string[] }) => {
    return (
        <Typography
            variant="body1"
            style={{
                textOverflow: "ellipsis",
                position: "relative",
                top: "-20px",
                height: "0",
                zIndex: 0,
                color: "#555555",
                width: 0,
            }}
        >
            {getChord(props.notes)}
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
        highlight,
        disabled,
    } = props
    const isChord = chordsAndNotes.notes.length > 2

    const getBackgroundColor = (note: string) => {
        if (highlight && note === " ") {
            return colors.focus
        }
        return getColor(note)
    }

    return (
        <>
            {isChord && <ChordText notes={chordsAndNotes.notes} />}
            <Box
                flexGrow={chordsAndNotes.length}
                flexShrink={0}
                display="flex"
                flexDirection="column"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    clone
                    mr={1}
                    mt={1}
                >
                    <ButtonBase
                        disabled={disabled}
                        focusRipple
                        onClick={onClick}
                        onContextMenu={onContextMenu}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {chordsAndNotes.notes.map((note, i) => {
                            const text = tangentToNumber(note)
                            return (
                                <Box
                                    key={note + i}
                                    pl={1}
                                    mt={i === 0 ? 0 : "1px"}
                                    borderColor="divider"
                                    border={disabled ? 0 : 1}
                                    bgcolor={getBackgroundColor(note)}
                                    display="flex"
                                    alignItems="center"
                                    width="100%"
                                    flexGrow={1}
                                    clone
                                >
                                    <Paper elevation={0} variant="outlined">
                                        <Box width="0px">{text}</Box>
                                    </Paper>
                                </Box>
                            )
                        })}
                    </ButtonBase>
                </Box>
            </Box>
        </>
    )
}
