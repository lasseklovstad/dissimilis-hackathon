import React from "react"
import {Box} from "@mui/material"
import {IChord} from "../../models/IBar"
import {useSongContext} from "../../views/SongView/SongContextProvider.component"
import {ChordWithCheckboxes} from "./ChordWithCheckboxes.component";
import {ChordAsButton} from "./ChordAsButton.component";
import {ChordText} from "./ChordText.component";

type ChordProps = {
    chord: IChord
    barPosition: number
    onContextMenu: (event: React.MouseEvent) => void
    onClick: (event: React.MouseEvent) => void
    onMouseEnter: () => void
    onMouseLeave: () => void
    highlight: boolean
    exportMode: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    isSelected: boolean
    handleChordFocus: () => void
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | null | undefined
    barEditMode: boolean
    barId: number
    onTouchEnd: () => void
}

export const Chord = (props: ChordProps) => {
    const {
        chord,
        barPosition,
        onClick,
        onContextMenu,
        onMouseEnter,
        onMouseLeave,
        getChordNameFromMainVoice,
        highlight,
        exportMode,
        showChordLetters,
        showNoteLetters,
        isSelected,
        handleChordFocus,
        barEditMode,
        onTouchEnd,
    } = props

    const chordName = getChordNameFromMainVoice(barPosition, chord.position)
    const {customMode} = useSongContext()

    return (
        <Box
            flexGrow={chord.length}
            display="flex"
            flexDirection="column"
            position="relative"
            height="100%"
            justifyContent="flex-end"
            flexBasis="0"
            mr={0.5}
            ml={0.5}
            minWidth={0}
        >
            {chordName && showChordLetters && (
                <ChordText chordName={chordName}/>
            )}
            {customMode ? (
                <ChordWithCheckboxes chord={chord} showNoteText={showNoteLetters} barPosition={barPosition}/>
            ) : (
                <ChordAsButton disabled={exportMode || barEditMode} ButtonProps={{
                    onClick,
                    onContextMenu,
                    onMouseEnter,
                    onMouseLeave,
                    onTouchEnd,
                    onFocus: handleChordFocus
                }} chord={chord} showNoteLetters={showNoteLetters} isSelected={isSelected} highlight={highlight}/>
            )}
        </Box>
    )
}
