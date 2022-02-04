import { Box } from "@mui/material"
import React from "react"
import { ChordCheckbox } from "./ChordCheckbox.component"
import { useAddNote, useRemoveNote } from "../../utils/useApiServiceSongs"
import { useSongDispatchContext } from "../../context/song/SongContextProvider.component"
import { IChord } from "../../models/IChord"

type ChordWithCheckboxesProps = {
    chord: IChord
    showNoteText: boolean
    barPosition: number
    songVoiceId: number
    songId: number
}

export const ChordWithCheckboxes = (props: ChordWithCheckboxesProps) => {
    const { chord, showNoteText, barPosition, songVoiceId, songId } = props
    const { dispatchSong } = useSongDispatchContext()
    const { removeNote } = useRemoveNote(songId, songVoiceId, barPosition)
    const { addNote } = useAddNote(songId, songVoiceId, barPosition)

    const handleCustomVoiceAddClick = async (index: number) => {
        if (!chord.chordName) {
            console.error(
                "Can't add note in chord, because this is not a chord!"
            )
            return false
        }
        const { error, result } = await addNote.run({
            chordName: chord.chordName,
            notePosition: chord.position,
            length: chord.length,
            intervalPosition: index,
            notes: chord.notes,
        })
        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            return true
        }
        return false
    }
    const handleCustomVoiceRemoveClick = async (index: number) => {
        if (!chord.chordName) {
            console.error(
                "Can't remove note in chord, because this is not a chord!"
            )
            return false
        }
        const { error, result } = await removeNote.run({
            deleteOnLastIntervalRemoved: true,
            chordName: chord.chordName,
            notePosition: chord.position,
            length: chord.length,
            intervalPosition: index,
            notes: chord.notes,
        })
        if (!error && result) {
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            return true
        }
        return false
    }

    const handleChange = async (checked: boolean, index: number) => {
        if (checked) {
            return handleCustomVoiceAddClick(index)
        } else {
            return handleCustomVoiceRemoveClick(index)
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 25px)",
                width: "100%",
                minWidth: 0,
                alignItems: "stretch",
            }}
        >
            {chord.notes
                .filter((note) => note !== "X")
                .map((note, i) => {
                    return (
                        <ChordCheckbox
                            note={note}
                            key={i}
                            selected={
                                chord.selectedNotes
                                    ? chord.selectedNotes[i] === note
                                    : false
                            }
                            onChange={(checked) => handleChange(checked, i)}
                            showNoteText={showNoteText}
                        />
                    )
                })
                .reverse()}
        </Box>
    )
}
