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

type SongProps = {
    barsPerRow: number
    selectedVoice: number
    bars: IBar[]
    timeSignature: string
    heightOfBar: number
    exportMode?: boolean
    page?: number
}

const BarPrefix = (props: { index: number; timeSignature: string }) => {
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
        bars,
        selectedVoice,
        timeSignature,
        heightOfBar,
        exportMode,
    } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedBar, setSelectedBar] = useState<number | undefined>()

    const getBarRows = (bars: IBar[]): IBar[][] => {
        // array of N elements, where N is the number of rows needed
        const rows = [...Array(Math.ceil(bars.length / barsPerRow))]
        // chunk the bars into the array of rows
        return rows.map((row, idx) =>
            bars.slice(idx * barsPerRow, idx * barsPerRow + barsPerRow)
        )
    }

    const openMenu = (barNumber: number) => (anchorEl: HTMLElement) => {
        setAnchorEl(anchorEl)
        setSelectedBar(barNumber)
    }

    const closeMenu = () => {
        setAnchorEl(null)
        setSelectedBar(undefined)
    }

    return (
        <>
            <Box width="100%">
                {getBarRows(bars).map((barsInRow, i, rows) => (
                    <Box display="flex" mt={exportMode ? 7 : 10} key={i}>
                        <BarPrefix
                            index={barsInRow[0].barNumber - 1}
                            timeSignature={timeSignature}
                        />
                        <BarLine />
                        <Box
                            display="flex"
                            flexGrow={barsInRow.length}
                            minWidth={0}
                            flexBasis="0"
                        >
                            {barsInRow.map((bar, i) => {
                                return (
                                    <React.Fragment key={i}>
                                        <Bar
                                            exportMode={!!exportMode}
                                            voiceId={selectedVoice}
                                            masterSheet={
                                                !exportMode &&
                                                selectedVoice === 0
                                            }
                                            onMenuClick={openMenu(
                                                bar.barNumber
                                            )}
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

            <BarMenu
                voiceId={selectedVoice}
                barNumber={selectedBar}
                anchorEl={anchorEl}
                onClose={closeMenu}
            />
        </>
    )
}
