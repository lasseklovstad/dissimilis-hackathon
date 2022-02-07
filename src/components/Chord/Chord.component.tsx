import React from "react"
import { ChordWithCheckboxes } from "./ChordWithCheckboxes.component"
import { ChordAsButton } from "./ChordAsButton.component"
import { ChordText } from "./ChordText.component"
import { ChordContainer } from "./ChordContainer.component"
import { IChord } from "../../models/IChord"

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

    return (
        <ChordContainer chordLength={chord.length}>
            {showChordLetters && (
                <ChordText
                    barPosition={barPosition}
                    chordPosition={chord.position}
                />
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
