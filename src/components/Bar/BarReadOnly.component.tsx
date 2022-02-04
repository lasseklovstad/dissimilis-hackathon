import { BarContainer } from "./BarContainer.component"
import React from "react"
import { VoltaBracket } from "./VoltaBracket.component"
import { RepetitionSign } from "./RepetitionSign.component"
import { IBar } from "../../models/IBar"
import { ChordReadOnly } from "../Chord/ChordReadOnly.component"
import { useTranslation } from "react-i18next"
import { fillBarWithEmptyChords } from "./barUtils"

type BarReadOnlyProps = {
    bar: IBar
    height?: number
    showVoltaBracketNumber: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | undefined | null
}

export const BarReadOnly = (props: BarReadOnlyProps) => {
    const {
        showVoltaBracketNumber,
        showChordLetters,
        showNoteLetters,
        getChordNameFromMainVoice,
        bar: {
            chords,
            repAfter,
            repBefore,
            voltaBracket,
            position: barPosition,
        },
        height,
    } = props
    const { t } = useTranslation()

    return (
        <>
            <BarContainer height={height} aria-label={t("Song.bar")}>
                <VoltaBracket
                    voltaBracketOrder={voltaBracket}
                    showVoltaBracketNumber={showVoltaBracketNumber}
                />
                <RepetitionSign display={repBefore} />
                {fillBarWithEmptyChords(chords).map((chord) => {
                    return (
                        <ChordReadOnly
                            key={chord.position}
                            chord={chord}
                            barPosition={barPosition}
                            showChordLetters={showChordLetters}
                            showNoteLetters={showNoteLetters}
                            getChordNameFromMainVoice={
                                getChordNameFromMainVoice
                            }
                        />
                    )
                })}
                <RepetitionSign display={repAfter} />
            </BarContainer>
        </>
    )
}
