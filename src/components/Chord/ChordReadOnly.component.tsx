import React from "react"
import { ChordText } from "./ChordText.component"
import { ChordAsBox } from "./ChordAsBox.component"
import { ChordContainer } from "./ChordContainer.component"
import { IChord } from "../../models/IChord"

type ChordReadOnlyProps = {
    chord: IChord
    barPosition: number
    showChordLetters: boolean
    showNoteLetters: boolean
}

export const ChordReadOnly = (props: ChordReadOnlyProps) => {
    const { chord, barPosition, showChordLetters, showNoteLetters } = props

    return (
        <ChordContainer chordLength={chord.length}>
            {showChordLetters && (
                <ChordText
                    barPosition={barPosition}
                    chordPosition={chord.position}
                />
            )}
            <ChordAsBox chord={chord} showNoteLetters={showNoteLetters} />
        </ChordContainer>
    )
}
