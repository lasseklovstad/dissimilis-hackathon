import React, { useContext, useState } from "react"
import { Box, useMediaQuery } from "@material-ui/core"
import { RepetitionSign } from "./RepetitionSign.component"
import { House } from "./House.component"
import { IBar, IChord } from "../../models/IBar"
import { Chord } from "./Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import { BarMenuButton } from "../BarMenu/BarMenuButton.component"
import { useCreateChord, useDeleteChord } from "../../utils/useApiServiceSongs"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { getNotesFromChord } from "../../models/chords"
import { getChord } from "../../utils/bar.util"

export const Bar = (props: {
    bar: IBar
    height?: number
    exportMode: boolean
    showChordLetters: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
    showHouseNumber: boolean
    setValuesForSelectedNote?: (
        noteId: number | undefined | null,
        barId: number | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => void
    selectedNoteId?: number | undefined | null
}) => {
    const {
        exportMode,
        showChordLetters,
        onMenuClick,
        masterSheet,
        showHouseNumber,
        bar: {
            chords,
            repAfter,
            repBefore,
            house,
            barId,
            songId,
            songVoiceId,
        },
        height = 160,
        setValuesForSelectedNote,
        selectedNoteId,
    } = props
    const [menuPosition, setMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const xl = useMediaQuery("(min-width: 1080px)")
    const [rightClicked, setRightClicked] = useState<number | null>(null)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const {
        dispatchSong,
        selectedChord,
        selectedNoteLength,
        isNoteSelected,
    } = useContext(SongContext)
    const { postChord } = useCreateChord(songId, songVoiceId, barId)
    const { deleteChord } = useDeleteChord(
        songId,
        songVoiceId,
        barId,
        rightClicked
    )

    const handleRightClick = (chordId: number | null) => (
        event: React.MouseEvent
    ) => {
        event.preventDefault()
        if (chordId !== null) {
            setMenuPosition({ top: event.clientY - 4, left: event.clientX - 2 })
            setRightClicked(chordId)
        }
    }

    const handleMenuSelect = async (method: "delete") => {
        if (method === "delete") {
            if (rightClicked) {
                const { error, result } = await deleteChord.run()
                if (!error && result) {
                    dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                }
            }
        }
    }

    const handleClick = async (chord: IChord) => {
        if (chord.notes[0] === "Z") {
            const notes = isNoteSelected
                ? [selectedChord]
                : getNotesFromChord(selectedChord)

            const position =
                positionArray.length > 0 ? positionArray[0] : chord.position
            const { error, result } = await postChord.run({
                position,
                length: selectedNoteLength,
                notes,
            } as IChord)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                setValuesForSelectedNote &&
                    setValuesForSelectedNote(
                        result.data.chords.find(
                            (c) => c.position === position
                        )?.chordId,
                        result.data.barId,
                        selectedChord,
                        selectedNoteLength,
                        isNoteSelected,
                        position
                    )
            }
        } else {
            const isNote = chord.notes.length === 1
            setValuesForSelectedNote &&
                setValuesForSelectedNote(
                    chord.chordId,
                    props.bar.barId,
                    isNote ? chord.notes[0] : getChord(chord.notes),
                    chord.length,
                    isNote,
                    chord.position
                )
        }
    }

    const handleChordFocus = (chord: IChord) => {
        if (chord.notes[0] !== "Z") {
            const isNote = chord.notes.length === 1
            setValuesForSelectedNote &&
                setValuesForSelectedNote(
                    chord.chordId,
                    barId,
                    isNote ? chord.notes[0] : getChord(chord.notes),
                    chord.length,
                    isNote,
                    chord.position
                )
        } else {
            setValuesForSelectedNote &&
                setValuesForSelectedNote(
                    undefined,
                    undefined,
                    selectedChord,
                    selectedNoteLength,
                    isNoteSelected,
                    chord.position
                )
        }
    }

    const onMouseEnterChord = (
        chord: IChord,
        indexOfChord: number,
        allChords: IChord[]
    ) => {
        if (xl && chord.notes[0] === "Z") {
            let i = 0
            while (i <= selectedNoteLength) {
                const start = indexOfChord - i
                const end = start + selectedNoteLength
                const interval = allChords.slice(start, end)
                const isOnlyRests =
                    interval.findIndex(
                        (currentChord) => currentChord.notes[0] !== "Z"
                    ) === -1
                if (isOnlyRests && interval.length === selectedNoteLength) {
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

    const onMouseLeaveChord = () => {
        setPositionArray([])
    }

    return (
        <>
            {masterSheet && <BarMenuButton onMenuClick={onMenuClick} />}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
                minWidth={0}
            >
                <House houseOrder={house} showHouseNumber={showHouseNumber} />

                <Box display="flex" minWidth={0}>
                    <RepetitionSign display={repBefore} />
                    <Box
                        height={height || "100%"}
                        display="flex"
                        width="100%"
                        minWidth={0}
                    >
                        {chords
                            .reduce((noter: IChord[], note) => {
                                if (note.notes[0] === "Z") {
                                    const numberOfRests = note.length
                                    const rests = []
                                    for (let i = 0; i < numberOfRests; i++) {
                                        rests.push({
                                            length: 1,
                                            notes: ["Z"],
                                            position: note.position + i,
                                            chordId: null,
                                        })
                                    }
                                    return [...noter, ...rests]
                                }
                                return [...noter, note]
                            }, [])
                            .map((chord, i, allChords) => {
                                const highlight = positionArray.includes(
                                    chord.position
                                )
                                return (
                                    <Chord
                                        showChordLetters={showChordLetters}
                                        disabled={exportMode}
                                        onMouseLeave={onMouseLeaveChord}
                                        onMouseEnter={() =>
                                            onMouseEnterChord(
                                                chord,
                                                i,
                                                allChords
                                            )
                                        }
                                        chords={chord}
                                        highlight={highlight}
                                        key={chord.position}
                                        onContextMenu={handleRightClick(
                                            chord.chordId
                                        )}
                                        onClick={() => handleClick(chord)}
                                        isSelected={
                                            selectedNoteId === chord.chordId
                                        }
                                        handleChordFocus={() =>
                                            handleChordFocus(chord)
                                        }
                                    />
                                )
                            })}
                    </Box>
                    <RepetitionSign display={repAfter} />
                    <ChordMenu
                        position={menuPosition}
                        onSelect={handleMenuSelect}
                    />
                </Box>
            </Box>
        </>
    )
}
