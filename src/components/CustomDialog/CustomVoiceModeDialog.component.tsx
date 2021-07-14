import { Backdrop, Button, Dialog, DialogTitle } from "@material-ui/core"
import React from "react"

import { useTranslation } from "react-i18next"
import { ISong } from "../../models/ISong"
import { IVoice } from "../../models/IVoice"
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

    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return baseVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }

    return (
        <div>
            <DialogTitle>{/*song.title*/ "title"}</DialogTitle>
            <Song
                barsPerRow={2}
                voice={newVoice || baseVoice}
                getChordNameFromMainVoice={getChordNameFromMainVoice}
                timeSignature={{
                    denominator: /* song?.denominator ||*/ 4,
                    numerator: /* song?.numerator ||*/ 4,
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
