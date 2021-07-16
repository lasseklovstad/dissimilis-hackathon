import { Backdrop, Button, Dialog, DialogTitle } from "@material-ui/core"
import React from "react"

import { useTranslation } from "react-i18next"
import { ISong } from "../../models/ISong"
import { IVoice } from "../../models/IVoice"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { useVoice } from "../../utils/useVoice"
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
    const { t } = useTranslation()
    const { songInit, getSong } = useGetSong(songId)
    const selectedVoiceId = useVoice(songInit?.voices)
    const selectedVoice = songInit?.voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )

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
