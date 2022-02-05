import { Typography } from "@mui/material"
import React from "react"
import { useSongContext } from "../../context/song/SongContextProvider.component"

export const ChordText = (props: {
    barPosition: number
    chordPosition: number
}) => {
    const { barPosition, chordPosition } = props
    const { song } = useSongContext()
    const getChordNameFromMainVoice = () => {
        return (
            song.voices[0]?.bars
                .find((mainBar) => mainBar.position === barPosition)
                ?.chords.find(
                    (mainChord) => mainChord.position === chordPosition
                )?.chordName || ""
        )
    }

    return (
        <Typography
            style={{
                zIndex: 0,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
                color: "#555555",
            }}
        >
            {`${getChordNameFromMainVoice()} `}
        </Typography>
    )
}
