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
    timeSignature: ITimeSignature
    heightOfBar: number
    exportMode?: boolean
    hideChordLetters?: boolean
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

    return <Box flexGrow={0}>{PrefixItem}</Box>
}

export const Song = (props: SongProps) => {
    const {
        barsPerRow,
        voice: { bars, isMain },
        timeSignature,
        heightOfBar,
        exportMode,
        hideChordLetters,
    } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedBar, setSelectedBar] = useState<IBar | undefined>()

    const getBarRows = (bars: IBar[]): IBar[][] => {
        // array of N elements, where N is the number of rows needed
        const rows = [...Array(Math.ceil(bars.length / barsPerRow))]
        // chunk the bars into the array of rows
        return rows.map((row, idx) =>
            bars.slice(idx * barsPerRow, idx * barsPerRow + barsPerRow)
        )
    }

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
                    <Box display="flex" mt={exportMode ? 7 : 10} key={i}>
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
                        >
                            {barsInRow.map((bar, i, bars) => {
                                const showHouseNumber =
                                    i === 0 || bars[i - 1].house !== bar.house
                                return (
                                    <React.Fragment key={i}>
                                        <Bar
                                            showHouseNumber={showHouseNumber}
                                            exportMode={!!exportMode}
                                            hideChordLetters={
                                                !!hideChordLetters
                                            }
                                            masterSheet={!exportMode && isMain}
                                            onMenuClick={openMenu(bar)}
                                            bar={bar}
                                            height={heightOfBar}
                                        />
                                        <BarLine />
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

            {selectedBar && (
                <BarMenu
                    bar={selectedBar}
                    anchorEl={anchorEl}
                    onClose={closeMenu}
                />
            )}
        </>
    )
}
