import { ButtonBaseProps } from "@mui/material"
import React from "react"
import { IChord } from "../../models/IBar"
import { getNoteText } from "./Chord.util"
import { Note } from "./Note.component"
import { ChordButton } from "./ChordButton.component"

type ChordAsButtonProps = {
    disabled: boolean
    ButtonProps: Pick<
        ButtonBaseProps,
        | "onClick"
        | "onContextMenu"
        | "onMouseEnter"
        | "onMouseLeave"
        | "onTouchEnd"
        | "onFocus"
    >
    chord: IChord
    showNoteLetters: boolean
    isSelected: boolean
    highlight: boolean
}

export const ChordAsButton = (props: ChordAsButtonProps) => {
    const {
        disabled,
        ButtonProps,
        chord,
        showNoteLetters,
        isSelected,
        highlight,
    } = props
    return (
        <ChordButton
            emptyChord={chord.notes[0] === "Z"}
            isSelected={isSelected}
            id="chordButton"
            disabled={disabled}
            disableRipple
            {...ButtonProps}
        >
            {chord.notes
                .filter((note) => note !== "X")
                .map((note) => {
                    return (
                        <Note
                            highlight={highlight && note === "Z"}
                            variant={"main"}
                            note={note}
                            id="singleChord"
                            key={note}
                            outline={false}
                        >
                            {getNoteText(note, showNoteLetters)}
                        </Note>
                    )
                })
                .reverse()}
        </ChordButton>
    )
}
