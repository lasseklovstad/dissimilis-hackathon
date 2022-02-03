import { Box } from "@mui/material"
import React from "react"
import { IChord } from "../../models/IBar"
import { ChordCheckbox } from "./ChordCheckbox.component"
import { useVoice } from "../../utils/useVoice"
import { useAddNote, useRemoveNote } from "../../utils/useApiServiceSongs"
import { useSongContext } from "../../context/song/SongContextProvider.component"

type ChordWithCheckboxesProps = {
    chord: IChord
    showNoteText: boolean
    barPosition: number
}

export const ChordWithCheckboxes = (props: ChordWithCheckboxesProps) => {
    const { chord, showNoteText, barPosition } = props
    const { song, dispatchSong } = useSongContext()
    const selectedVoice = useVoice(song?.voices)

    const { addNote } = useAddNote(
        song?.songId,
        selectedVoice?.songVoiceId,
        barPosition
    )

    const handleCustomVoiceAddClick = async (index: number) => {
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

    const { removeNote } = useRemoveNote(
        song?.songId,
        selectedVoice?.songVoiceId,
        barPosition
    )
    const handleCustomVoiceRemoveClick = async (index: number) => {
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
