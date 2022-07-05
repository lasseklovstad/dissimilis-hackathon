import React, { useRef, useState } from "react"
import { Box } from "@mui/material"
import { BarMenu } from "../BarMenu/BarMenu.component"
import { IBar } from "../../models/IBar"
import { ITimeSignature } from "../../models/ITimeSignature"
import { IVoice } from "../../models/IVoice"
import { SongVariantType } from "./SongVariantType"
import { BarRowComponent } from "../Bar/BarRow.component"
import { useHotkeys } from "react-hotkeys-hook"
import { usePlaySong } from "../../utils/usePlaySong.util"

type SongProps = {
    barsPerRow: number
    voice: IVoice
    timeSignature: ITimeSignature
    heightOfBar: number
    variant: SongVariantType
    showChordLetters?: boolean
    showNoteLetters?: boolean
    lastPage: boolean
    barIndexOffset?: number
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
        barIndexOffset = 0,
    } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedBar, setSelectedBar] = useState<IBar | undefined>()
    const { playPosition } = usePlaySong(
        barsPerRow,
        bars.length,
        props.voice.songId
    )

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
                    <BarRowComponent
                        key={barsInRow[0].barId}
                        variant={variant}
                        barsInRow={barsInRow}
                        heightOfBar={heightOfBar}
                        index={i * barsPerRow + barIndexOffset}
                        timeSignature={timeSignature}
                        showChordLetters={showChordLetters}
                        showNoteLetters={showNoteLetters}
                        lastPage={lastPage}
                        lastBarPosition={lastBarPosition}
                        isMain={isMain}
                        openMenu={openMenu}
                        barsPerRow={barsPerRow}
                        playPosition={playPosition}
                    />
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
