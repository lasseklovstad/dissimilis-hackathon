import { ButtonBaseProps } from "@mui/material"
import React from "react"
import { getNoteText } from "./Chord.util"
import { Note } from "./Note.component"
import { ChordButton } from "./ChordButton.component"
import { IChord } from "../../models/IChord"
import { useTranslation } from "react-i18next"

type ChordAsButtonProps = {
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
    const { ButtonProps, chord, showNoteLetters, isSelected, highlight } = props
    const { t } = useTranslation()
    const isEmpty = chord.notes[0] === "Z"

    const getAriaLabel = () => {
        if (isEmpty) {
            return t("Song.emptyChord")
        } else {
            return chord.chordName
                ? `${t("Song.chordLabel")} ${chord.chordName}`
                : `${t("Song.noteLabel")} ${chord.notes[0]}`
        }
    }

    return (
        <ChordButton
            emptyChord={isEmpty}
            aria-selected={isSelected}
            aria-label={getAriaLabel()}
            id="chordButton"
            disableRipple
            {...ButtonProps}
        >
            {chord.notes
                .filter((note) => note !== "X")
                .map((note) => {
                    return (
                        <Note
                            highlight={highlight && note === "Z"}
                            variant="main"
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
