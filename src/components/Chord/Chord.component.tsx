import React from "react"
import { IChord } from "../../models/IBar"
import { ChordWithCheckboxes } from "./ChordWithCheckboxes.component"
import { ChordAsButton } from "./ChordAsButton.component"
import { ChordText } from "./ChordText.component"
import { ChordContainer } from "./ChordContainer.component"

export type ChordDisplayVariant = "note-checkbox" | "chord-button"

type ChordProps = {
    chord: IChord
    songVoiceId: number
    barPosition: number
    onContextMenu: (event: React.MouseEvent) => void
    onClick: (event: React.MouseEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    highlight: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    isSelected: boolean
    handleChordFocus: () => void
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | null | undefined
    barId: number
    onTouchEnd: () => void
    variant: ChordDisplayVariant
    songId: number
}

export const Chord = (props: ChordProps) => {
    const {
        chord,
        barPosition,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        getChordNameFromMainVoice,
        highlight,
        showChordLetters,
        showNoteLetters,
        isSelected,
        handleChordFocus,
        onTouchEnd,
        songVoiceId,
        variant = "chord-button",
        songId,
    } = props

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)

    return (
        <ChordContainer chordLength={chord.length}>
            {chordName && showChordLetters && (
                <ChordText chordName={chordName} />
            )}
            {variant === "note-checkbox" ? (
                <ChordWithCheckboxes
                    chord={chord}
                    showNoteText={showNoteLetters}
                    barPosition={barPosition}
                    songVoiceId={songVoiceId}
                    songId={songId}
                />
            ) : (
                <ChordAsButton
                    ButtonProps={{
                        onClick,
                        onContextMenu,
                        onMouseEnter,
                        onMouseLeave,
                        onTouchEnd,
                        onFocus: handleChordFocus,
                    }}
                    chord={chord}
                    showNoteLetters={showNoteLetters}
                    isSelected={isSelected}
                    highlight={highlight}
                />
            )}
        </ChordContainer>
    )
}
