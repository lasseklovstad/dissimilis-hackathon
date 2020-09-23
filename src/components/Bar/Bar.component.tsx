import React, { useContext, useState } from "react"
import { Box } from "@material-ui/core"
import { RepetitionSign } from "./RepetitionSign.component"
import { House } from "./House.component"
import { IBar, IChordAndNotes } from "../../models/IBar"
import { Chord } from "./Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { BarMenuButton } from "../BarMenu/BarMenuButton.component"

export const Bar = (props: {
    bar: IBar
    height?: number
    voiceId: number
    exportMode: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    masterSheet: boolean
}) => {
    const {
        exportMode,
        onMenuClick,
        masterSheet,
        bar: { barNumber, chordsAndNotes, repAfter, repBefore, house },
        voiceId,
        height = 160,
    } = props
    const [menuPosition, setMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const [rightClicked, setRightClicked] = useState(-1)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const {
        insertNewNoteOrChord,
        availablePositions,
        selectPositionArray,
    } = useContext(SongToolsContext)
    const { deleteNote } = useContext(SongContext)

    const handleRightClick = (i: number) => (event: React.MouseEvent) => {
        event.preventDefault()
        setMenuPosition({ top: event.clientY - 4, left: event.clientX - 2 })
        setRightClicked(i)
    }

    const handleMenuSelect = (method: "delete") => {
        if (method === "delete") {
            if (rightClicked >= 0) {
                const tempChordsAndNotes: IChordAndNotes[] = chordsAndNotes.slice()
                const newNote: IChordAndNotes = { length: 1, notes: [" "] }
                tempChordsAndNotes[rightClicked] = newNote
                for (
                    let i = rightClicked;
                    i < chordsAndNotes[rightClicked].length + rightClicked - 1;
                    i++
                ) {
                    tempChordsAndNotes.splice(i, 0, newNote)
                }
                deleteNote(props.voiceId, barNumber - 1, tempChordsAndNotes)
                setPositionArray([])
            }
        }
    }

    const handleClick = (i: number) => {
        if (
            availablePositions[voiceId][barNumber - 1] !== undefined &&
            availablePositions[voiceId][barNumber - 1].find((arr) =>
                arr.includes(i)
            ) != null
        ) {
            insertNewNoteOrChord(i, barNumber - 1, props.voiceId)
        }
    }

    const onMouseEnterChord = (index: number) => {
        setPositionArray(selectPositionArray(voiceId, barNumber - 1, index))
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
            >
                <House houseOrder={house} />

                <Box display="flex" flexBasis="100%">
                    <RepetitionSign display={repBefore} />
                    <Box height={height || "100%"} display="flex" width="100%">
                        {chordsAndNotes.map((notes, i) => {
                            return (
                                <Chord
                                    disabled={exportMode}
                                    onMouseLeave={() => onMouseLeaveChord()}
                                    onMouseEnter={() => onMouseEnterChord(i)}
                                    chordsAndNotes={notes}
                                    highlight={positionArray.includes(i)}
                                    key={i}
                                    onContextMenu={handleRightClick(i)}
                                    onClick={() => handleClick(i)}
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
