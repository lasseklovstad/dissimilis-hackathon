import { Box } from "@mui/material"
import React from "react"
import { getNoteText } from "./Chord.util"
import { Note } from "./Note.component"
import { IChord } from "../../models/IChord"

export const chordStyles = {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 25px)",
    width: "100%",
    minWidth: 0,
    alignItems: "stretch",
    borderRadius: "3px",
} as const

type ChordAsBoxProps = {
    chord: IChord
    showNoteLetters: boolean
}

export const ChordAsBox = (props: ChordAsBoxProps) => {
    const { chord, showNoteLetters } = props
    return (
        <Box sx={chordStyles}>
            {chord.notes
                .filter((note) => note !== "X")
                .map((note) => {
                    return (
                        <Note
                            variant="main"
                            note={note}
                            id="singleChord"
                            key={note}
                            outline={false}
                        >
                            {getNoteText(note, showNoteLetters)}
                        </Note>
                    )
                })
                .reverse()}
        </Box>
    )
}
