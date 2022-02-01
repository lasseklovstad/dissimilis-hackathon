import { ChordOptions } from "../BottomMenuButtons/BottomMenuButtons"
import React from "react"
import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import { Paper } from "@mui/material"

type SelectedChordIntervalsProps = {}

export const SelectedChordIntervals = (props: SelectedChordIntervalsProps) => {
    const {} = props
    const { chordMenuOptions, selectedChordId } = useSongContext()

    if (
        selectedChordId &&
        chordMenuOptions &&
        chordMenuOptions.chordType === ChordType.CHORD &&
        chordMenuOptions.chord
    ) {
        return (
            <Paper
                elevation={6}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    pl: 1,
                    pr: 1,
                    m: 1,
                }}
            >
                <ChordOptions
                    chord={chordMenuOptions.chord}
                    addChordInterval={() => console.log("add")}
                    removeChordInterval={() => console.log("Remove")}
                />
            </Paper>
        )
    }

    return null
}
