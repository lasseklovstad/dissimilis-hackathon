import React, { useState } from "react"
import { useMediaQuery } from "@mui/material"
import { RepetitionSign } from "./RepetitionSign.component"
import { VoltaBracket } from "./VoltaBracket.component"
import { IBar, IChord } from "../../models/IBar"
import { Chord } from "../Chord/Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import { BarMenuButton } from "../BarMenu/BarMenuButton.component"
import { useCreateChord, useDeleteChord } from "../../utils/useApiServiceSongs"
import { useSongDispatchContext } from "../../context/song/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import { useTranslation } from "react-i18next"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { BarContainer } from "./BarContainer.component"
import { fillBarWithEmptyChords } from "./barUtils"
import { IPosition } from "../../models/IPosition"
import { SongVariantType } from "../Song/SongVariantType"

type BarProps = {
    bar: IBar
    height?: number
    showChordLetters: boolean
    showNoteLetters: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | undefined | null
    masterSheet: boolean
    showVoltaBracketNumber: boolean
    variant: SongVariantType
}

export const Bar = (props: BarProps) => {
    const {
        showChordLetters,
        showNoteLetters,
        getChordNameFromMainVoice,
        onMenuClick,
        masterSheet,
        showVoltaBracketNumber,
        bar: {
            chords,
            repAfter,
            repBefore,
            voltaBracket,
            barId,
            songId,
            songVoiceId,
            position,
        },
        height,
        variant,
    } = props
    const { t } = useTranslation()
    const [chordMenuPosition, setChordMenuPosition] = useState<IPosition>()
    const usingTouchScreen = useMediaQuery(
        "(@media (hover: none) and (pointer: coarse)"
    )
    const [rightClickedChordId, setRightClickedChordId] = useState<
        number | null
    >(null)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const { dispatchSong } = useSongDispatchContext()
    const { chordMenuOptions } = useChordMenuOptionsContext()
    const { selectedChord, setSelectedChord } = useSelectedChordContext()
    const { postChord } = useCreateChord(songId, songVoiceId, barId)
    const { deleteChord } = useDeleteChord()

    const handleChordRightClick =
        (chordId: number | null) => (event: React.MouseEvent) => {
            event.preventDefault()
            if (chordId !== null) {
                setChordMenuPosition({
                    top: event.clientY - 4,
                    left: event.clientX - 2,
                })
                setRightClickedChordId(chordId)
            }
        }

    const handleChordMenuSelect = async (method: string) => {
        if (method === "delete" && rightClickedChordId) {
            const { error, result } = await deleteChord.run({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: rightClickedChordId,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
    }

    const handleChordClick = async (chord: IChord) => {
        if (chord.notes[0] === "Z" && chordMenuOptions) {
            const notes =
                chordMenuOptions.chordType === ChordType.NOTE
                    ? [chordMenuOptions.chord]
                    : null

            const position =
                positionArray.length > 0 ? positionArray[0] : chord.position

            const chordName =
                chordMenuOptions.chordType === ChordType.CHORD
                    ? chordMenuOptions.chord
                    : null

            const { error, result } = await postChord.run({
                position,
                length: chordMenuOptions.chordLength,
                notes,
                chordName,
            } as IChord)

            if (!error && result) {
                const createdChord = result.data.chords.find(
                    (c) => c.position === position
                )
                if (createdChord && createdChord.chordId) {
                    dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                    setSelectedChord({
                        songId,
                        voiceId: songVoiceId,
                        barId,
                        chordId: createdChord.chordId,
                    })
                }
            }
        } else if (chord.chordId) {
            setSelectedChord({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: chord.chordId,
            })
        }
    }

    const handleChordFocus = (chord: IChord) => {
        if (chord.notes[0] !== "Z" && chord.chordId) {
            setSelectedChord({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: chord.chordId,
            })
        } else {
            setSelectedChord(null)
        }
    }

    const onMouseEnterChord = (
        chord: IChord,
        indexOfChord: number,
        allChords: IChord[]
    ) => {
        if (usingTouchScreen && chord.notes[0] === "Z" && chordMenuOptions) {
            let i = 0
            while (i <= chordMenuOptions.chordLength) {
                const start = indexOfChord - i
                const end = start + chordMenuOptions.chordLength
                const interval = allChords.slice(start, end)
                const isOnlyRests =
                    interval.findIndex(
                        (currentChord) => currentChord.notes[0] !== "Z"
                    ) === -1
                if (
                    isOnlyRests &&
                    interval.length === chordMenuOptions.chordLength
                ) {
                    setPositionArray(
                        interval.map((currentChord) => currentChord.position)
                    )
                    break
                }
                i++
            }
        } else {
            setPositionArray([chord.position])
        }
    }

    return (
        <>
            {masterSheet && variant === "normal-edit" && (
                <BarMenuButton onMenuClick={onMenuClick} />
            )}

            <BarContainer height={height} aria-label={t("Song.bar")}>
                <VoltaBracket
                    voltaBracketOrder={voltaBracket}
                    showVoltaBracketNumber={showVoltaBracketNumber}
                />
                <RepetitionSign display={repBefore} />
                {fillBarWithEmptyChords(chords).map((chord, i, allChords) => {
                    const highlight = positionArray.includes(chord.position)
                    return (
                        <Chord
                            key={chord.position}
                            barPosition={position}
                            songId={songId}
                            showChordLetters={showChordLetters}
                            getChordNameFromMainVoice={
                                getChordNameFromMainVoice
                            }
                            showNoteLetters={showNoteLetters}
                            onMouseLeave={() => setPositionArray([])}
                            onMouseEnter={() =>
                                onMouseEnterChord(chord, i, allChords)
                            }
                            variant={
                                variant === "normal-edit"
                                    ? "chord-button"
                                    : "note-checkbox"
                            }
                            onTouchEnd={() => setPositionArray([])}
                            barId={barId}
                            chord={chord}
                            highlight={highlight}
                            onContextMenu={handleChordRightClick(chord.chordId)}
                            onClick={() => handleChordClick(chord)}
                            isSelected={
                                selectedChord?.chordId === chord.chordId
                            }
                            handleChordFocus={() => handleChordFocus(chord)}
                            songVoiceId={songVoiceId}
                        />
                    )
                })}
                <RepetitionSign display={repAfter} />
                <ChordMenu
                    position={chordMenuPosition}
                    onSelect={handleChordMenuSelect}
                />
            </BarContainer>
        </>
    )
}
