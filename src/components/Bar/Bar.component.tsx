import React, { useContext, useState } from "react"
import { Box, Grid, makeStyles } from "@material-ui/core"
import { RepetitionSign } from "./RepetitionSign.component"
import { House } from "./House.component"
import { BarBody } from "./BarBody.component"
import { IChordAndNotes } from "../../models/IBar"
import { Chord } from "./Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import {
    SongToolsContext,
    SongToolsContextProvider,
} from "../../views/SongView/SongToolsContextProvider.component"

const useStyles = makeStyles({
    root: {
        width: "100%",
        padding: "8px",
    },
    firstRow: {
        height: "32px",
    },
    fullHeight: {
        height: "100%",
    },
})

export const Bar = (props: {
    barNumber: number
    repBefore: boolean
    repAfter: boolean
    house?: number
    chordsAndNotes: IChordAndNotes[]
    height?: number
    voiceId: number
    exportMode?: boolean
    rowsPerSheet?: number
}) => {
    const [menuPosition, setMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const [activeChord, setActiveChord] = useState<number | undefined>()
    const { selectedNoteLength } = useContext(SongToolsContext)

    const handleRightClick = (event: React.MouseEvent) => {
        event.preventDefault()
        setMenuPosition({ top: event.clientY - 4, left: event.clientX - 2 })
    }

    const handleMenuSelect = (action: "delete") => {}

    const handleClick = () => {}

    const onMouseEnterChord = (index: number) => {
        setActiveChord(index)
    }

    const onMouseLeaveChord = () => {
        setActiveChord(undefined)
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            width="100%"
        >
            <House houseOrder={props.house} />

            <Box display="flex" flexBasis="100%">
                <RepetitionSign display={props.repBefore} />
                <Box
                    height={props.height || "100%"}
                    display="flex"
                    width="100%"
                >
                    {props.chordsAndNotes.map((notes, i) => {
                        return (
                            <Chord
                                onMouseLeave={() => onMouseLeaveChord}
                                onMouseEnter={() => onMouseEnterChord(i)}
                                chordsAndNotes={notes}
                                key={i}
                                onContextMenu={handleRightClick}
                                onClick={handleClick}
                            />
                        )
                    })}
                </Box>
                <RepetitionSign display={props.repAfter} />
                <ChordMenu
                    position={menuPosition}
                    onSelect={handleMenuSelect}
                />
            </Box>
        </Box>
    )
}
