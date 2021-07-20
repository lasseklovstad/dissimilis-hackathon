import { Button, DialogTitle } from "@material-ui/core"
import React from "react"

import { IVoice } from "../../models/IVoice"
import { useGetSong } from "../../utils/useApiServiceSongs"

import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { Song } from "../Song/Song.component"

export const CustomVoiceDialog = (props: {
    handleOnSave: () => void
    handleOnCancel: () => void
    songId: string
    baseVoice: IVoice
    newVoice: IVoice | undefined
}) => {
    const { handleOnCancel, handleOnSave, songId, baseVoice, newVoice } = props
    const { songInit /* , getSong  */ } = useGetSong(songId)

    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return baseVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }
    const { song } = useSongContext()
    return (
        <div>
            <DialogTitle>{newVoice?.voiceName}</DialogTitle>
            <Song
                barsPerRow={2}
                voice={song.voices[0]}
                getChordNameFromMainVoice={getChordNameFromMainVoice}
                timeSignature={{
                    numerator: songInit?.numerator || 4,
                    denominator: songInit?.denominator || 4,
                }}
                heightOfBar={185}
                lastPage={false}
            />
            <Button
                onClick={handleOnSave}
                style={{ backgroundColor: " lightgrey" }}
            >
                LAGRE
            </Button>
            <Button
                onClick={handleOnCancel}
                style={{ backgroundColor: " lightgrey" }}
            >
                AVBRYT
            </Button>
        </div>
    )
}
