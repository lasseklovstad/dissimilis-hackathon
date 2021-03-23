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
import { ChordType } from "../../models/IChordMenuOptions"

export const Bar = (props: {
    bar: IBar
    height?: number
    exportMode: boolean
    showChordLetters: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
    showHouseNumber: boolean
}) => {
    const {
        exportMode,
        showChordLetters,
        onMenuClick,
        masterSheet,
        showHouseNumber,
        bar: { chords, repAfter, repBefore, house, barId, songId, songVoiceId },
        height = 160,
    } = props
    const [menuPosition, setMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const xl = useMediaQuery("(min-width: 1080px)")
    const [rightClicked, setRightClicked] = useState<number | null>(null)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const {
        dispatchSong,
        chordMenuOptions,
        setValuesForSelectedChord,
        dispatchChordMenuOptions,
        selectedChordId,
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

    const updateMenuOptions = (chord: IChord) => {
        const chordType =
            chord.notes.length === 1 ? ChordType.NOTE : ChordType.CHORD
        dispatchChordMenuOptions({
            type: "UPDATE_OPTIONS",
            menuOptions: {
                chordLength: chord.length,
                chord:
                    chordType === ChordType.NOTE
                        ? chord.notes[0]
                        : chord.activeChord,
                chordType: chordType,
                chordNotes: chord.notes,
            },
        })
    }

    const handleClick = async (chord: IChord) => {
        if (chord.notes[0] === "Z") {
            const notes =
                chordMenuOptions.chordType === ChordType.NOTE
                    ? [chordMenuOptions.chord]
                    : getNotesFromChord(chordMenuOptions.chord)

            const position =
                positionArray.length > 0 ? positionArray[0] : chord.position

            const { error, result } = await postChord.run({
                position,
                length: chordMenuOptions.chordLength,
                notes,
                activeChord: chordMenuOptions.chord 
            } as IChord)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                setValuesForSelectedChord(
                    result.data.chords.find((c) => c.position === position)
                        ?.chordId,
                    result.data.barId,
                    position
                )
            }
        } else {
            updateMenuOptions(chord)
            setValuesForSelectedChord(
                chord.chordId,
                props.bar.barId,
                chord.position
            )
        }
    }

    const handleChordFocus = (chord: IChord) => {
        if (chord.notes[0] !== "Z") {
            setValuesForSelectedChord(chord.chordId, barId, chord.position)
            updateMenuOptions(chord)
        } else {
            setValuesForSelectedChord(undefined, undefined, chord.position)
        }
    }

    const onMouseEnterChord = (
        chord: IChord,
        indexOfChord: number,
        allChords: IChord[]
    ) => {
        if (xl && chord.notes[0] === "Z") {
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
                                            activeChord: "",
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
                                            selectedChordId === chord.chordId
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
