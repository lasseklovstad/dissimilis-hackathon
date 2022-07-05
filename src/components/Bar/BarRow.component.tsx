import { BarLine } from "../barLine/BarLine.component"
import { BarReadOnly } from "./BarReadOnly.component"
import { BarEdit } from "./BarEdit.component"
import { Bar } from "./Bar.component"
import { BarPrefix } from "./BarPrefix.component"
import { Box } from "@mui/material"
import { SongVariantType } from "../Song/SongVariantType"
import { IBar } from "../../models/IBar"
import { ITimeSignature } from "../../models/ITimeSignature"
import React from "react"
import { PositionIndicator } from "../PositionIndicator/PositionIndicator.component"

type BarRowComponentProps = {
    variant: SongVariantType
    barsInRow: IBar[]
    heightOfBar: number
    index: number
    timeSignature: ITimeSignature
    showChordLetters: boolean
    showNoteLetters: boolean
    lastPage: boolean
    barIndexOffset?: number
    lastBarPosition: number
    isMain: boolean
    openMenu: (bar: IBar) => (anchorEl: HTMLElement) => void
    barsPerRow: number
    playPosition: number
}

export const BarRowComponent = ({
    variant,
    barsInRow,
    heightOfBar,
    index,
    timeSignature,
    showChordLetters,
    showNoteLetters,
    lastPage,
    lastBarPosition,
    isMain,
    openMenu,
    barsPerRow,
    playPosition,
}: BarRowComponentProps) => {
    const getPlayPosition = () => {
        const minPos = index
        const maxPos = index + barsPerRow
        if (minPos < playPosition && maxPos >= playPosition) {
            const pos = ((playPosition - minPos) * 100) / barsPerRow
            return pos
        } else {
            return 0
        }
    }
    return (
        <>
            <Box
                display="flex"
                alignItems="flex-end"
                mt={variant === "normal-edit" ? 7 : 5}
                key={barsInRow[0].barId}
                height={heightOfBar}
            >
                <PositionIndicator
                    height={heightOfBar}
                    left={getPlayPosition()}
                    barsPerRow={barsPerRow}
                />
                <BarPrefix index={index} timeSignature={timeSignature} />
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
                                        showChordLetters={showChordLetters}
                                        showNoteLetters={showNoteLetters}
                                    />
                                    <BarLine />
                                    {bar.position === lastBarPosition &&
                                        lastPage && <BarLine lastPosition />}
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
                                        showChordLetters={showChordLetters}
                                        showNoteLetters={showNoteLetters}
                                        bar={bar}
                                        height={heightOfBar}
                                    />
                                    <BarLine />
                                    {bar.position === lastBarPosition &&
                                        lastPage && <BarLine lastPosition />}
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
                                    lastPage && <BarLine lastPosition />}
                            </React.Fragment>
                        )
                    })}
                </Box>
                <Box flexGrow={barsPerRow - barsInRow.length} flexBasis="0" />
            </Box>
        </>
    )
}
