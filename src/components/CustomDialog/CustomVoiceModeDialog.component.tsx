import { Backdrop, Button, Dialog, DialogTitle } from "@material-ui/core"
import React from "react"

import { useTranslation } from "react-i18next"
import { ISong } from "../../models/ISong"
import { IVoice } from "../../models/IVoice"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { useVoice } from "../../utils/useVoice"
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
    console.log(baseVoice.voiceName)
    return (
        <div>
            <DialogTitle>{newVoice?.voiceName /*song.title*/}</DialogTitle>
            <Song
                barsPerRow={2}
                voice={baseVoice}
                getChordNameFromMainVoice={getChordNameFromMainVoice}
                timeSignature={{
                    denominator: songInit?.numerator || 4,
                    numerator: songInit?.denominator || 4,
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
