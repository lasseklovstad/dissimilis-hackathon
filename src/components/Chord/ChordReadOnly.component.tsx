import React from "react"
import { IChord } from "../../models/IBar"
import { ChordText } from "./ChordText.component"
import { ChordAsBox } from "./ChordAsBox.component"
import { ChordContainer } from "./ChordContainer.component"

type ChordReadOnlyProps = {
    chord: IChord
    barPosition: number
    showChordLetters: boolean
    showNoteLetters: boolean
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | null | undefined
}

export const ChordReadOnly = (props: ChordReadOnlyProps) => {
    const {
        chord,
        barPosition,
        getChordNameFromMainVoice,
        showChordLetters,
        showNoteLetters,
    } = props

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)

    return (
        <ChordContainer chordLength={chord.length}>
            {chordName && showChordLetters && (
                <ChordText chordName={chordName} />
            )}
            <ChordAsBox chord={chord} showNoteLetters={showNoteLetters} />
        </ChordContainer>
    )
}
