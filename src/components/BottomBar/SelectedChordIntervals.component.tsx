import React from "react"
import { Paper } from "@mui/material"
import { ISelectedChord } from "../../models/ISelectedChord"
import { IBar } from "../../models/IBar"
import { useAddNote, useRemoveNote } from "../../utils/useApiServiceSongs"
import { useSongDispatchContext } from "../../context/song/SongContextProvider.component"
import { ChordOptions } from "../ChordOptions/ChordOptions"
import { IChord } from "../../models/IChord"

const getSelectedIntervalIndexes = (notes: string[]) => {
    return notes
        .map((note, index) => {
            if (note !== "X") {
                return index
            }
            return -1
        })
        .filter((noteIndex) => noteIndex !== -1)
}

type SelectedChordIntervalsProps = {
    selectedChord: ISelectedChord
    selectedChordAsChord: IChord
    selectedChordBar: IBar
}

export const SelectedChordIntervals = (props: SelectedChordIntervalsProps) => {
    const { selectedChord, selectedChordAsChord, selectedChordBar } = props
    const { dispatchSong } = useSongDispatchContext()
    const selected = getSelectedIntervalIndexes(selectedChordAsChord.notes)
    const { addNote } = useAddNote(
        selectedChord.songId,
        selectedChord.voiceId,
        selectedChordBar.position
    )
    const { removeNote } = useRemoveNote(
        selectedChord.songId,
        selectedChord.voiceId,
        selectedChordBar.position
    )

    if (!selectedChordAsChord.chordName) {
        return null
    }

    const handleAddInterval = async (intervalPosition: number) => {
        if (!selectedChordAsChord.chordName) {
            console.error(
                "Can't add note in chord, because this is not a chord!"
            )
            return
        }
        const { error, result } = await addNote.run({
            chordName: selectedChordAsChord.chordName,
            notePosition: selectedChordAsChord.position,
            length: selectedChordAsChord.length,
            intervalPosition,
            notes: selectedChordAsChord.notes,
        })
        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        }
    }

    const handleRemoveInterval = async (intervalPosition: number) => {
        if (!selectedChordAsChord.chordName) {
            console.error(
                "Can't remove note in chord, because this is not a chord!"
            )
            return
        }
        const { error, result } = await removeNote.run({
            deleteOnLastIntervalRemoved: true,
            chordName: selectedChordAsChord.chordName,
            notePosition: selectedChordAsChord.position,
            length: selectedChordAsChord.length,
            intervalPosition,
            notes: selectedChordAsChord.notes,
        })
        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        }
    }

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
                chord={selectedChordAsChord.chordName}
                selectedIntervalPositions={selected}
                addChordInterval={handleAddInterval}
                removeChordInterval={handleRemoveInterval}
            />
        </Paper>
    )
}
