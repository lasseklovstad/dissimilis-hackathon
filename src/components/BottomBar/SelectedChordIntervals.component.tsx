import { ChordOptions } from "../BottomMenuButtons/BottomMenuButtons"
import React from "react"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import { Paper } from "@mui/material"
import { useAddComponentInterval } from "../../utils/useApiServiceSongs"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"

type SelectedChordIntervalsProps = {}

export const SelectedChordIntervals = (props: SelectedChordIntervalsProps) => {
    const {} = props
    const {
        chordMenuOptions,
        song: { songId },
    } = useSongContext()
    const { selectedChord } = useSelectedChordContext()

    const handleAddInterval = () => {}

    const handleRemoveInterval = () => {}

    if (
        selectedChord &&
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
                    addChordInterval={handleAddInterval}
                    removeChordInterval={handleRemoveInterval}
                />
            </Paper>
        )
    }

    return null
}
