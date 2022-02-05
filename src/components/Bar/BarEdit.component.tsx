import React, { useState } from "react"
import { RepetitionSign } from "./RepetitionSign.component"
import { VoltaBracket } from "./VoltaBracket.component"
import { IBar } from "../../models/IBar"
import {
    useSongContext,
    useSongDispatchContext,
} from "../../context/song/SongContextProvider.component"
import BarRightClickMenu from "./BarRightClickMenu.component"
import { useTranslation } from "react-i18next"
import { useBars } from "../../utils/useBars"
import { BarContainer } from "./BarContainer.component"
import { fillBarWithEmptyChords } from "./barUtils"
import { ChordReadOnly } from "../Chord/ChordReadOnly.component"
import { IPosition } from "../../models/IPosition"

type BarEditProps = {
    bar: IBar
    height?: number
    showChordLetters: boolean
    showNoteLetters: boolean
    showVoltaBracketNumber: boolean
}

export const BarEdit = (props: BarEditProps) => {
    const {
        showChordLetters,
        showNoteLetters,
        showVoltaBracketNumber,
        bar: { chords, repAfter, repBefore, voltaBracket, songId, position },
        height,
    } = props
    const { t } = useTranslation()
    const [barMenuPosition, setBarMenuPosition] = useState<IPosition>()
    const { setBarsClipboard, barsClipboard, selectedBars, setSelectedBars } =
        useSongContext()
    const { dispatchSong } = useSongDispatchContext()
    const { copySelectedBars, barClicked, pasteBars, deleteBars } = useBars(
        songId,
        dispatchSong,
        selectedBars,
        setSelectedBars,
        barsClipboard,
        setBarsClipboard
    )

    const handleBarRightClick = (event: React.MouseEvent) => {
        event.preventDefault()
        setBarMenuPosition({
            top: event.clientY - 4,
            left: event.clientX - 2,
        })
    }

    const handleBarMenuSelect = (method: string) => {
        if (method === "copy") {
            copySelectedBars()
        } else if (method === "pasteBefore") {
            pasteBars && pasteBars("pasteBefore", props.bar)
        } else if (method === "pasteAfter") {
            pasteBars && pasteBars("pasteAfter", props.bar)
        } else if (method === "delete") {
            deleteBars && deleteBars()
        }
    }
    return (
        <>
            <BarContainer
                height={height}
                buttonProps={{
                    onClick: (e: React.MouseEvent) => {
                        ;(e.target as HTMLElement).id !== "menuItem" &&
                            barClicked(props.bar)
                    },
                    selected:
                        selectedBars &&
                        props.bar.position >= selectedBars.fromPosition &&
                        props.bar.position <= selectedBars.toPosition,
                    onContextMenu: handleBarRightClick,
                }}
                aria-label={`${t("Song.bar")} ${position}`}
                button
            >
                <VoltaBracket
                    voltaBracketOrder={voltaBracket}
                    showVoltaBracketNumber={showVoltaBracketNumber}
                />
                <RepetitionSign display={repBefore} />
                {fillBarWithEmptyChords(chords).map((chord, i, allChords) => {
                    return (
                        <ChordReadOnly
                            key={chord.position}
                            chord={chord}
                            barPosition={position}
                            showChordLetters={showChordLetters}
                            showNoteLetters={showNoteLetters}
                        />
                    )
                })}
                <RepetitionSign display={repAfter} />
                <BarRightClickMenu
                    barsClipboard={barsClipboard}
                    selectedBars={selectedBars}
                    onSelect={handleBarMenuSelect}
                    position={barMenuPosition}
                />
            </BarContainer>
        </>
    )
}
