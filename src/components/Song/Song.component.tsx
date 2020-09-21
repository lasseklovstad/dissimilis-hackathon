import React, { useState } from "react"
import { Box } from "@material-ui/core"
import { BarLine } from "../barLine/BarLine.component"
import { BarContainer } from "../BarContainer/BarContainer.component"
import { BarMenu } from "../BarMenu/BarMenu.component"
import { IBar } from "../../models/IBar"
import {
    BarNumber,
    TimeSignature,
} from "../SongViewComponents/SongView.component"

type SongProps = {
    barsPerRow: number
    selectedVoice: number
    bars: IBar[]
    timeSignature: string
    heightOfBar: number
    exportMode?: boolean
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
        const updatedBars = bars.map((bar, i) => ({ ...bar, barNumber: i + 1 }))
        // chunk the bars into the array of rows
        return rows.map((row, idx) =>
            updatedBars.slice(idx * barsPerRow, idx * barsPerRow + barsPerRow)
        )
    }

    const openMenu = (anchorEl: HTMLElement, barNumber: number) => {
        setAnchorEl(anchorEl)
        setSelectedBar(barNumber)
    }

    const closeMenu = () => {
        setAnchorEl(null)
        setSelectedBar(undefined)
    }

    return (
        <>
            {getBarRows(bars).map((barsInRow, i) => (
                <Box width="100%" display="flex" mt={10}>
                    <BarPrefix index={i} timeSignature={timeSignature} />
                    <BarLine />
                    <Box display="flex" flexGrow={12}>
                        {barsInRow.map((bar) => {
                            return (
                                <React.Fragment key={bar.barNumber}>
                                    <BarContainer
                                        voiceId={selectedVoice}
                                        masterSheet={
                                            !exportMode && selectedVoice === 0
                                        }
                                        onMenuClick={openMenu}
                                        bar={bar}
                                        height={heightOfBar}
                                    />
                                    <BarLine />
                                </React.Fragment>
                            )
                        })}
                    </Box>
                </Box>
            ))}
            <BarMenu
                voiceId={selectedVoice}
                barNumber={selectedBar}
                anchorEl={anchorEl}
                onClose={closeMenu}
            />
        </>
    )
}
