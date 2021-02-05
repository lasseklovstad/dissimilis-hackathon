import React, { useContext, useState } from "react"
import { Box, useMediaQuery } from "@material-ui/core"
import { RepetitionSign } from "./RepetitionSign.component"
import { House } from "./House.component"
import { IBar, IChordAndNotes } from "../../models/IBar"
import { Chord } from "./Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import { BarMenuButton } from "../BarMenu/BarMenuButton.component"
import { useCreateChord, useDeleteChord } from "../../utils/useApiServiceSongs"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { getChordFromNotes, getNotesFromChord } from "../../models/chords"

export const Bar = (props: {
    bar: IBar
    height?: number
    exportMode: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
    showHouseNumber: boolean
    setSelectedNoteId: (
        noteId: number | undefined,
        bar: IBar | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => void
    selectedNoteId: number | undefined
}) => {
    const {
        exportMode,
        onMenuClick,
        masterSheet,
        showHouseNumber,
        bar: {
            chordsAndNotes,
            repAfter,
            repBefore,
            house,
            barId,
            songId,
            songVoiceId,
        },
        height = 160,
        setSelectedNoteId,
        selectedNoteId,
    } = props
    const [menuPosition, setMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const xl = useMediaQuery("(min-width: 1920px)")
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

    const handleRightClick = (noteId: number | null) => (
        event: React.MouseEvent
    ) => {
        event.preventDefault()
        setMenuPosition({ top: event.clientY - 4, left: event.clientX - 2 })
        setRightClicked(noteId)
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

    const handleClick = async (
        position: number,
        noteId: number | null,
        chord: IChordAndNotes
    ) => {
        if (!noteId) {
            setSelectedNoteId(undefined, undefined, "C", 1, true, 0)
            const notes = isNoteSelected
                ? [selectedChord]
                : getNotesFromChord(selectedChord)
            const { error, result } = await postChord.run({
                position:
                    positionArray.length > 0 ? positionArray[0] : position,
                length: selectedNoteLength,
                notes,
            } as IChordAndNotes)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        } else {
            const highlightedChord = getChordFromNotes(chord.notes)
            if (chord.notes.length === 1) {
                setSelectedNoteId(
                    noteId,
                    props.bar,
                    chord.notes[0],
                    chord.length,
                    true,
                    chord.position,
                )
                return
            }
            
                setSelectedNoteId(
                    noteId,
                    props.bar,
                    highlightedChord,
                    chord.length,
                    false,
                    chord.position,
                )
                
        }
    }

    const onMouseEnterChord = (
        chord: IChordAndNotes,
        indexOfChord: number,
        allChords: IChordAndNotes[]
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
            setPositionArray([])
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
                        {chordsAndNotes
                            .reduce((noter: IChordAndNotes[], note) => {
                                if (note.notes[0] === "Z") {
                                    const numberOfRests = note.length
                                    const rests = []
                                    for (let i = 0; i < numberOfRests; i++) {
                                        rests.push({
                                            length: 1,
                                            notes: ["Z"],
                                            position: note.position + i,
                                            noteId: null,
                                        })
                                    }
                                    return [...noter, ...rests]
                                }
                                return [...noter, note]
                            }, [])
                            .map((chord, i, allChords) => {
                                const highlight =
                                    positionArray.includes(chord.position) ||
                                    chord.noteId === selectedNoteId
                                return (
                                    <Chord
                                        disabled={exportMode}
                                        onMouseLeave={onMouseLeaveChord}
                                        onMouseEnter={() =>
                                            onMouseEnterChord(
                                                chord,
                                                i,
                                                allChords
                                            )
                                        }
                                        chordsAndNotes={chord}
                                        highlight={highlight}
                                        key={chord.position}
                                        onContextMenu={handleRightClick(
                                            chord.noteId
                                        )}
                                        onClick={() =>
                                            handleClick(
                                                chord.position,
                                                chord.noteId,
                                                chord
                                            )
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
