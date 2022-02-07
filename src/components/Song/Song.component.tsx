import React, { useState } from "react"
import { Box } from "@mui/material"
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
import { BarReadOnly } from "../Bar/BarReadOnly.component"
import { SongVariantType } from "./SongVariantType"
import { BarEdit } from "../Bar/BarEdit.component"

type SongProps = {
    barsPerRow: number
    voice: IVoice
    timeSignature: ITimeSignature
    heightOfBar: number
    variant: SongVariantType
    showChordLetters?: boolean
    showNoteLetters?: boolean
    lastPage: boolean
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
        timeSignature,
        heightOfBar,
        variant,
        showChordLetters = true,
        showNoteLetters = true,
        lastPage,
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
                        mt={variant === "normal-edit" ? 7 : 5}
                        key={barsInRow[0].barId}
                        height={heightOfBar}
                    >
                        <BarPrefix
                            index={i * barsPerRow}
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

                                if (variant === "read-only") {
                                    return (
                                        <React.Fragment key={bar.barId}>
                                            <BarReadOnly
                                                bar={bar}
                                                showVoltaBracketNumber={
                                                    showVoltaBracketNumber
                                                }
                                                showChordLetters={
                                                    showChordLetters
                                                }
                                                showNoteLetters={
                                                    showNoteLetters
                                                }
                                            />
                                            <BarLine />
                                            {bar.position === lastBarPosition &&
                                                lastPage && (
                                                    <BarLine lastPosition />
                                                )}
                                        </React.Fragment>
                                    )
                                }
                                if (variant === "bar-edit") {
                                    return (
                                        <React.Fragment key={bar.barId}>
                                            <BarEdit
                                                showVoltaBracketNumber={
                                                    showVoltaBracketNumber
                                                }
                                                showChordLetters={
                                                    showChordLetters
                                                }
                                                showNoteLetters={
                                                    showNoteLetters
                                                }
                                                bar={bar}
                                                height={heightOfBar}
                                            />
                                            <BarLine />
                                            {bar.position === lastBarPosition &&
                                                lastPage && (
                                                    <BarLine lastPosition />
                                                )}
                                        </React.Fragment>
                                    )
                                }
                                return (
                                    <React.Fragment key={bar.barId}>
                                        <Bar
                                            showVoltaBracketNumber={
                                                showVoltaBracketNumber
                                            }
                                            showChordLetters={showChordLetters}
                                            showNoteLetters={showNoteLetters}
                                            masterSheet={isMain}
                                            onMenuClick={openMenu(bar)}
                                            bar={bar}
                                            height={heightOfBar}
                                            variant={variant}
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

            {selectedBar && variant === "normal-edit" && (
                <BarMenu
                    bar={selectedBar}
                    anchorEl={anchorEl}
                    onClose={closeMenu}
                />
            )}
        </>
    )
}
