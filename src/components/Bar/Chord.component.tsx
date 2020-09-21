import React from "react"
import { Box, ButtonBase, Paper, Typography } from "@material-ui/core"
import { Chord as TonalChord } from "@tonaljs/tonal"
import { IChordAndNotes } from "../../models/IBar"
import { colors } from "../../utils/colors"

type ChordProps = {
    chordsAndNotes: IChordAndNotes
    onContextMenu: (event: React.MouseEvent) => void
    onClick: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

/* Gets the chord based on notes. The package we use (tonaljs) uses the tone "B" instead of "H" so we need
to replace H with B to get the right chord. 
*/
const getChord = (notes: string[]): string => {
    const tempArray = notes.slice()
    const index = tempArray.indexOf("H")
    if (index !== -1) {
        tempArray[index] = "B"
    }

    if (tempArray.length === 1) {
        return notes[0]
    }
    const result = TonalChord.detect(tempArray.reverse())
    if (result.length === 0) return notes[0]
    return result[0].replace(/M/g, "").replace(/B/g, "H")
}

const getColor = (note: string): string => {
    let newColor = "transparent"
    switch (note) {
        case "C":
            newColor = colors.C
            break
        case "D":
            newColor = colors.D
            break
        case "E":
            newColor = colors.E
            break
        case "F":
            newColor = colors.F
            break
        case "G":
            newColor = colors.G
            break
        case "A":
            newColor = colors.A
            break
        case "H":
            newColor = colors.H
            break
        case "C#":
        case "D#":
        case "F#":
        case "G#":
        case "A#":
            newColor = colors.gray_500
            break
        default:
            newColor = "transparent"
    }
    return newColor
}

const tangentToNumber = (tangent: string): number | string => {
    switch (tangent) {
        case "C#":
            return 4
        case "D#":
            return 5
        case "F#":
            return 1
        case "G#":
            return 2
        case "A#":
            return 3
        default:
            return tangent
    }
}

const ChordText = (props: { notes: string[] }) => {
    return (
        <Typography
            variant="body1"
            style={{
                textOverflow: "ellipsis",
                paddingLeft: "4px",
                position: "relative",
                top: "-20px",
                height: "0",
                zIndex: 100,
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
    } = props
    const isChord = chordsAndNotes.notes.length > 2

    return (
        <>
            {isChord && <ChordText notes={chordsAndNotes.notes} />}
            <Box
                flexGrow={chordsAndNotes.length}
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
                        focusRipple
                        onClick={onClick}
                        onContextMenu={onContextMenu}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {chordsAndNotes.notes.map((note) => {
                            const text = tangentToNumber(note)
                            return (
                                <Box
                                    p={1}
                                    bgcolor={getColor(note)}
                                    display="flex"
                                    alignItems="center"
                                    width="100%"
                                    flex={1}
                                    overflow="hidden"
                                    clone
                                >
                                    <Paper elevation={0} variant="outlined">
                                        {text}
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
