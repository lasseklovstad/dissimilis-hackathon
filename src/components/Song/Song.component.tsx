import React, { useState } from "react"
import { Box } from "@material-ui/core"
import { BarLine } from "../barLine/BarLine.component"
import { BarMenu } from "../BarMenu/BarMenu.component"
import { IBar } from "../../models/IBar"
import {
    BarNumber,
    TimeSignature,
} from "../SongViewComponents/SongView.component"
import { Bar } from "../Bar/Bar.component"
import { ITimeSignature } from "../../models/ITimeSignature"
import { IVoice } from "../../models/IVoice"

type SongProps = {
    barsPerRow: number
    voice: IVoice
    updatedVoice?: IVoice
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | null | undefined
    timeSignature: ITimeSignature
    heightOfBar: number
    exportMode?: boolean
    showChordLetters?: boolean
    showNoteLetters?: boolean
    lastPage: boolean
    pasteBars?: (type: "pasteBefore" | "pasteAfter", bar: IBar) => void
    deleteBars?: () => void
    currentUserHasWriteAccess?: boolean
}

const BarPrefix = (props: { index: number; timeSignature: ITimeSignature }) => {
    const { index, timeSignature } = props

    const getPrefixItem = () => {
        if (index === 0) {
            return <TimeSignature timeSignature={timeSignature} />
        }
        return <BarNumber barNumber={index + 1} />
    }
    const PrefixItem = getPrefixItem()

    return (
        <Box flexGrow={0} height="calc(100% - 25px)">
            {PrefixItem}
        </Box>
    )
}

export const Song = (props: SongProps) => {
    const {
        barsPerRow,
        voice: { bars, isMain },
        getChordNameFromMainVoice,
        timeSignature,
        heightOfBar,
        exportMode,
        showChordLetters,
        showNoteLetters,
        lastPage,
        currentUserHasWriteAccess = false,
        updatedVoice,
    } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedBar, setSelectedBar] = useState<IBar | undefined>()

    const getBarRows = (bars: IBar[]): IBar[][] => {
        /* if(updatedVoice){
            console.log(updatedVoice)
            bars = updatedVoice.bars
        } */
        // array of N elements, where N is the number of rows needed
        const rows = [...Array(Math.ceil(bars.length / barsPerRow))]
        // chunk the bars into the array of rows
        return rows.map((row, idx) =>
            bars.slice(idx * barsPerRow, idx * barsPerRow + barsPerRow)
        )
    }

    const lastBarPosition = Math.max.apply(
        Math,
        bars.map((bar) => bar.position)
    )

    const openMenu = (bar: IBar) => (anchorEl: HTMLElement) => {
        setAnchorEl(anchorEl)
        setSelectedBar(bar)
    }

    const closeMenu = () => {
        setAnchorEl(null)
        setSelectedBar(undefined)
    }

    return (
        <>
            <Box width="100%">
                {getBarRows(bars).map((barsInRow, i) => (
                    <Box
                        display="flex"
                        alignItems="flex-end"
                        mt={exportMode ? 5 : i === 0 ? 7 : 10}
                        key={i}
                        height={heightOfBar}
                    >
                        <BarPrefix
                            index={barsInRow[0].position - 1}
                            timeSignature={timeSignature}
                        />
                        <BarLine />
                        <Box
                            display="flex"
                            flexGrow={barsInRow.length}
                            minWidth={0}
                            flexBasis="0"
                            alignItems="flex-end"
                            height="100%"
                        >
                            {barsInRow.map((bar, i, bars) => {
                                const showVoltaBracketNumber =
                                    (i === 0 || bars[i - 1].voltaBracket) !==
                                    bar.voltaBracket
                                return (
                                    <React.Fragment key={i}>
                                        <Bar
                                            // eslint-disable-next-line
                                            showVoltaBracketNumber={
                                                showVoltaBracketNumber
                                            }
                                            exportMode={!!exportMode}
                                            showChordLetters={
                                                showChordLetters === undefined
                                                    ? true
                                                    : showChordLetters
                                            }
                                            showNoteLetters={
                                                showNoteLetters === undefined
                                                    ? true
                                                    : showNoteLetters
                                            }
                                            masterSheet={!exportMode && isMain}
                                            getChordNameFromMainVoice={
                                                getChordNameFromMainVoice
                                            }
                                            onMenuClick={openMenu(bar)}
                                            bar={bar}
                                            height={heightOfBar}
                                            currentUserHasWriteAccess={
                                                currentUserHasWriteAccess
                                            }
                                        />
                                        <BarLine />
                                        {bar.position === lastBarPosition &&
                                            lastPage && (
                                                <BarLine lastPosition />
                                            )}
                                    </React.Fragment>
                                )
                            })}
                        </Box>
                        <Box
                            flexGrow={barsPerRow - barsInRow.length}
                            flexBasis="0"
                        />
                    </Box>
                ))}
            </Box>

            {selectedBar && currentUserHasWriteAccess && (
                <BarMenu
                    bar={selectedBar}
                    anchorEl={anchorEl}
                    onClose={closeMenu}
                />
            )}
        </>
    )
}
