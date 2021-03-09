import React, { RefObject, useContext, useState } from "react"
import { Box, useMediaQuery } from "@material-ui/core"
import { RepetitionSign } from "./RepetitionSign.component"
import { House } from "./House.component"
import { IBar, IChordAndNotes } from "../../models/IBar"
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
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
    showHouseNumber: boolean
    setValuesForSelectedNote: (
        noteId: number | undefined | null,
        barId: number | undefined,
        chord: string,
        noteLength: number,
        isNote: boolean,
        position: number
    ) => void
    selectedNoteId: number | undefined | null
    refHighlightedNote: RefObject<HTMLAnchorElement> | undefined
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
        // Should be setActiveChord
        setValuesForSelectedNote,
        // selectedChordId
        selectedNoteId,
        refHighlightedNote,
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
    const [hasFocus, setHasFocus] = useState(false)

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

    const handleClick = async (chord: IChordAndNotes) => {
        if (!chord.noteId) {
            const notes = isNoteSelected
                ? [selectedChord]
                : getNotesFromChord(selectedChord)

            const position =
                positionArray.length > 0 ? positionArray[0] : chord.position
            const { error, result } = await postChord.run({
                position,
                length: selectedNoteLength,
                notes,
            } as IChordAndNotes)

            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                setValuesForSelectedNote(
                    result.data.chordsAndNotes.find(
                        (c) => c.position === position
                    )?.noteId,
                    result.data.barId,
                    selectedChord,
                    selectedNoteLength,
                    isNoteSelected,
                    position
                )
            }
        } else {
            if (chord.noteId === selectedNoteId) {
                setValuesForSelectedNote(
                    undefined,
                    undefined,
                    selectedChord,
                    selectedNoteLength,
                    isNoteSelected,
                    0
                )
                return
            }
            const isNote = chord.notes.length === 1
            setValuesForSelectedNote(
                chord.noteId,
                props.bar.barId,
                isNote ? chord.notes[0] : getChord(chord.notes),
                chord.length,
                isNote,
                chord.position
            )
        }
    }

    const onChordFocus = (chord: IChordAndNotes) => {
        if(chord.notes[0] !== "Z") {
            const isNote = chord.notes.length === 1
            setValuesForSelectedNote(
                chord.noteId,
                barId,
                isNote ? chord.notes[0] : getChord(chord.notes),
                chord.length,
                isNote,
                chord.position
            )
        } 
        else {
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
                                    positionArray.includes(chord.position)
                                const activeChord = selectedNoteId === chord.noteId
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
                                        onChordFocus={() => onChordFocus(chord)}
                                        chordsAndNotes={chord}
                                        highlight={highlight}
                                        key={chord.position}
                                        onContextMenu={handleRightClick(
                                            chord.noteId
                                        )}
                                        onClick={() => handleClick(chord)}
                                        refHighlightedNote={refHighlightedNote}
                                        isSelected={activeChord}
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
