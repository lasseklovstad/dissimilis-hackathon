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
import { ChordType } from "../../models/IChordMenuOptions"
import { makeStyles } from "@material-ui/core/styles"
import { colors } from "../../utils/colors"
import BarRightClickMenu from "./BarRightClickMenu.component"

const useStyle = makeStyles(() => ({
    barContainer: {
        display: "flex",
        minWidth: 0,
        borderRadius: "5px",
        padding: "3px 0px 3px 0px",
        "&.editMode": {
            boxShadow: `0 0 0px 4px ${colors.gray_400}`,
            backgroundColor: colors.gray_200,
            "&:hover": {
                boxShadow: `0 0 0px 4px ${colors.focus}`,
            },
            "&.selected": {
                boxShadow: `0 0 0px 4px ${colors.focus}`,
                backgroundColor: colors.teal_100,
            },
        },
    },
}))

export const Bar = (props: {
    bar: IBar
    height?: number
    exportMode: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
    showHouseNumber: boolean
    pasteBars?: (type: "pasteBefore" | "pasteAfter", bar: IBar) => void
    deleteBars?: () => void
}) => {
    const {
        exportMode,
        showChordLetters,
        showNoteLetters,
        onMenuClick,
        masterSheet,
        showHouseNumber,
        bar: { chords, repAfter, repBefore, house, barId, songId, songVoiceId },
        height,
    } = props
    const [chordMenuPosition, setChordMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const [barMenuPosition, setBarMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const xl = useMediaQuery("(min-width: 1080px)")
    const [rightClickedChordId, setRightClickedChordId] = useState<
        number | null
    >(null)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const {
        dispatchSong,
        chordMenuOptions,
        setValuesForSelectedChord,
        dispatchChordMenuOptions,
        selectedChordId,
        editBars,
    } = useContext(SongContext)
    const { postChord } = useCreateChord(songId, songVoiceId, barId)
    const { deleteChord } = useDeleteChord(
        songId,
        songVoiceId,
        barId,
        rightClickedChordId
    )
    const classes = useStyle()

    const handleChordRightClick = (chordId: number | null) => (
        event: React.MouseEvent
    ) => {
        event.preventDefault()
        if (!editBars.barEditMode && chordId !== null) {
            setChordMenuPosition({
                top: event.clientY - 4,
                left: event.clientX - 2,
            })
            setRightClickedChordId(chordId)
        }
    }

    const handleBarRightClick = (event: React.MouseEvent) => {
        event.preventDefault()
        if (editBars.barEditMode) {
            setBarMenuPosition({
                top: event.clientY - 4,
                left: event.clientX - 2,
            })
        }
    }

    const handleChordMenuSelect = async (method: string) => {
        if (method === "delete" && rightClickedChordId) {
            const { error, result } = await deleteChord.run()
            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
    }

    const handleBarMenuSelect = (method: string) => {
        if (method === "copy") {
            editBars.copyBars()
        } else if (method === "pasteBefore") {
            props.pasteBars && props.pasteBars("pasteBefore", props.bar)
        } else if (method === "pasteAfter") {
            props.pasteBars && props.pasteBars("pasteAfter", props.bar)
        } else if (method === "delete") {
            props.deleteBars && props.deleteBars()
        }
    }

    const updateMenuOptions = (chord: IChord) => {
        const chordType = !chord.chordName ? ChordType.NOTE : ChordType.CHORD
        dispatchChordMenuOptions({
            type: "UPDATE_OPTIONS",
            menuOptions: {
                chordLength: chord.length,
                chord:
                    chordType === ChordType.NOTE
                        ? chord.notes[0]
                        : chord.chordName,
                chordType: chordType,
                chordNotes: chord.notes,
            },
        })
    }

    const handleChordClick = async (chord: IChord) => {
        if (chord.notes[0] === "Z") {
            const notes =
                chordMenuOptions.chordType === ChordType.NOTE
                    ? [chordMenuOptions.chord]
                    : getNotesFromChord(chordMenuOptions.chord)

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
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                dispatchChordMenuOptions({
                    type: "UPDATE_CHORD_NOTES",
                    chordNotes: notes as string[],
                })
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

    return (
        <>
            {masterSheet && <BarMenuButton onMenuClick={onMenuClick} />}
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
                minWidth={0}
                m="2px"
            >
                <House houseOrder={house} showHouseNumber={showHouseNumber} />

                <div
                    id="barContainer"
                    onContextMenu={(e) =>
                        editBars.barEditMode && handleBarRightClick(e)
                    }
                    className={`${classes.barContainer} ${
                        editBars.barEditMode ? "editMode" : ""
                    } ${
                        editBars.selectedBars &&
                        props.bar.position >=
                            editBars.selectedBars.fromPosition &&
                        props.bar.position <= editBars.selectedBars.toPosition
                            ? "selected"
                            : ""
                    }`}
                    onClick={(e: React.MouseEvent) => {
                        ;(e.target as HTMLElement).id !== "menuItem" &&
                            editBars.barEditMode &&
                            editBars.barClicked(props.bar)
                    }}
                >
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
                                            chordName: "",
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
                                        showNoteLetters={showNoteLetters}
                                        disabled={exportMode}
                                        onMouseLeave={() =>
                                            !editBars.barEditMode &&
                                            setPositionArray([])
                                        }
                                        onMouseEnter={() =>
                                            !editBars.barEditMode &&
                                            onMouseEnterChord(
                                                chord,
                                                i,
                                                allChords
                                            )
                                        }
                                        chords={chord}
                                        highlight={highlight}
                                        key={chord.position}
                                        onContextMenu={handleChordRightClick(
                                            chord.chordId
                                        )}
                                        onClick={() =>
                                            !editBars.barEditMode &&
                                            handleChordClick(chord)
                                        }
                                        isSelected={
                                            selectedChordId === chord.chordId
                                        }
                                        handleChordFocus={() =>
                                            !editBars.barEditMode &&
                                            handleChordFocus(chord)
                                        }
                                        barEditMode={editBars.barEditMode}
                                    />
                                )
                            })}
                    </Box>
                    <RepetitionSign display={repAfter} />
                    <ChordMenu
                        position={chordMenuPosition}
                        onSelect={handleChordMenuSelect}
                    />
                    <BarRightClickMenu
                        barsClipboard={editBars.barsClipboard}
                        selectedBars={editBars.selectedBars}
                        onSelect={handleBarMenuSelect}
                        position={barMenuPosition}
                    />
                </div>
            </Box>
        </>
    )
}
