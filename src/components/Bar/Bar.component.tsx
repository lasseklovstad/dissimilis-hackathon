import React, { useState } from "react"
import { Box, useMediaQuery } from "@mui/material"
import { RepetitionSign } from "./RepetitionSign.component"
import { VoltaBracket } from "./VoltaBracket.component"
import { IBar, IChord } from "../../models/IBar"
import { Chord } from "./Chord.component"
import { ChordMenu } from "./ChordMenu.component"
import { BarMenuButton } from "../BarMenu/BarMenuButton.component"
import { useCreateChord, useDeleteChord } from "../../utils/useApiServiceSongs"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { ChordType } from "../../models/IChordMenuOptions"
import makeStyles from "@mui/styles/makeStyles"
import { colors } from "../../utils/colors"
import BarRightClickMenu from "./BarRightClickMenu.component"
import { useTranslation } from "react-i18next"
import { useBars } from "../../utils/useBars"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"

const useStyle = makeStyles(() => ({
    barContainer: {
        display: "flex",
        minWidth: 0,
        borderRadius: "5px",
        padding: "3px 0px 3px 0px",
        "&.editMode": {
            boxShadow: `0 0 0px 4px ${colors.gray_400}`,
            backgroundColor: colors.gray_200,
            "&:hover": {
                boxShadow: `0 0 0px 4px ${colors.focus}`,
            },
            "&.selected": {
                boxShadow: `0 0 0px 4px ${colors.focus}`,
                backgroundColor: colors.teal_100,
            },
        },
    },
}))

export const Bar = (props: {
    updatedBar?: boolean[][]
    bar: IBar
    height?: number
    exportMode: boolean
    showChordLetters: boolean
    showNoteLetters: boolean
    onMenuClick: (anchorEl: HTMLElement) => void
    getChordNameFromMainVoice: (
        barPosition: number,
        chordPosition: number
    ) => string | undefined | null
    masterSheet: boolean
    showVoltaBracketNumber: boolean
    pasteBars?: (type: "pasteBefore" | "pasteAfter", bar: IBar) => void
    deleteBars?: () => void
    currentUserHasWriteAccess?: boolean
}) => {
    const {
        updatedBar,
        exportMode,
        showChordLetters,
        showNoteLetters,
        getChordNameFromMainVoice,
        onMenuClick,
        masterSheet,
        showVoltaBracketNumber,
        bar: {
            chords,
            repAfter,
            repBefore,
            voltaBracket,
            barId,
            songId,
            songVoiceId,
            position,
        },
        height,
        currentUserHasWriteAccess,
    } = props
    const { t } = useTranslation()
    const [chordMenuPosition, setChordMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const [barMenuPosition, setBarMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const usingTouchScreen = useMediaQuery(
        "(@media (hover: none) and (pointer: coarse)"
    )
    const [rightClickedChordId, setRightClickedChordId] = useState<
        number | null
    >(null)
    const [positionArray, setPositionArray] = useState<number[]>([])
    const {
        dispatchSong,
        barEditMode,
        setBarsClipboard,
        barsClipboard,
        selectedBars,
        setSelectedBars,
    } = useSongContext()
    const { chordMenuOptions } = useChordMenuOptionsContext()
    const { selectedChord, setSelectedChord } = useSelectedChordContext()
    const { copySelectedBars, barClicked, pasteBars, deleteBars } = useBars(
        songId,
        dispatchSong,
        selectedBars,
        setSelectedBars,
        barsClipboard,
        setBarsClipboard
    )
    const { postChord } = useCreateChord(songId, songVoiceId, barId)
    const { deleteChord } = useDeleteChord()
    const classes = useStyle()

    const handleChordRightClick =
        (chordId: number | null) => (event: React.MouseEvent) => {
            event.preventDefault()
            if (!barEditMode && currentUserHasWriteAccess && chordId !== null) {
                setChordMenuPosition({
                    top: event.clientY - 4,
                    left: event.clientX - 2,
                })
                setRightClickedChordId(chordId)
            }
        }

    const handleBarRightClick = (event: React.MouseEvent) => {
        event.preventDefault()
        if (barEditMode) {
            setBarMenuPosition({
                top: event.clientY - 4,
                left: event.clientX - 2,
            })
        }
    }

    const handleChordMenuSelect = async (method: string) => {
        if (method === "delete" && rightClickedChordId) {
            const { error, result } = await deleteChord.run({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: rightClickedChordId,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
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

    const handleChordClick = async (chord: IChord) => {
        if (
            chord.notes[0] === "Z" &&
            currentUserHasWriteAccess &&
            chordMenuOptions
        ) {
            const notes =
                chordMenuOptions.chordType === ChordType.NOTE
                    ? [chordMenuOptions.chord]
                    : null

            const position =
                positionArray.length > 0 ? positionArray[0] : chord.position

            const chordName =
                chordMenuOptions.chordType === ChordType.CHORD
                    ? chordMenuOptions.chord
                    : null

            const { error, result } = await postChord.run({
                position,
                length: chordMenuOptions.chordLength,
                notes,
                chordName,
            } as IChord)

            if (!error && result) {
                const createdChord = result.data.chords.find(
                    (c) => c.position === position
                )
                if (createdChord && createdChord.chordId) {
                    dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                    setSelectedChord({
                        songId,
                        voiceId: songVoiceId,
                        barId,
                        chordId: createdChord.chordId,
                    })
                }
            }
        } else if (chord.chordId) {
            setSelectedChord({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: chord.chordId,
            })
        }
    }

    const handleChordFocus = (chord: IChord) => {
        if (chord.notes[0] !== "Z" && chord.chordId) {
            setSelectedChord({
                songId,
                voiceId: songVoiceId,
                barId,
                chordId: chord.chordId,
            })
        } else {
            setSelectedChord(null)
        }
    }

    const onMouseEnterChord = (
        chord: IChord,
        indexOfChord: number,
        allChords: IChord[]
    ) => {
        if (usingTouchScreen && chord.notes[0] === "Z" && chordMenuOptions) {
            let i = 0
            while (i <= chordMenuOptions.chordLength) {
                const start = indexOfChord - i
                const end = start + chordMenuOptions.chordLength
                const interval = allChords.slice(start, end)
                const isOnlyRests =
                    interval.findIndex(
                        (currentChord) => currentChord.notes[0] !== "Z"
                    ) === -1
                if (
                    isOnlyRests &&
                    interval.length === chordMenuOptions.chordLength
                ) {
                    setPositionArray(
                        interval.map((currentChord) => currentChord.position)
                    )
                    break
                }
                i++
            }
        } else {
            setPositionArray([chord.position])
        }
    }

    return (
        <>
            {masterSheet && currentUserHasWriteAccess && (
                <BarMenuButton onMenuClick={onMenuClick} />
            )}

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
                minWidth={0}
                m="2px"
                aria-label={t("Song.bar")}
            >
                <VoltaBracket
                    voltaBracketOrder={voltaBracket}
                    showVoltaBracketNumber={showVoltaBracketNumber}
                />

                <div
                    id="barContainer"
                    onContextMenu={(e) => barEditMode && handleBarRightClick(e)}
                    className={`${classes.barContainer} ${
                        barEditMode ? "editMode" : ""
                    } ${
                        selectedBars &&
                        props.bar.position >= selectedBars.fromPosition &&
                        props.bar.position <= selectedBars.toPosition
                            ? "selected"
                            : ""
                    }`}
                    onClick={(e: React.MouseEvent) => {
                        ;(e.target as HTMLElement).id !== "menuItem" &&
                            barEditMode &&
                            barClicked(props.bar)
                    }}
                >
                    <RepetitionSign display={repBefore} />
                    <Box
                        height={height || "100%"}
                        display="flex"
                        width="100%"
                        minWidth={0}
                    >
                        {chords
                            .reduce((noter: IChord[], note) => {
                                if (note.notes[0] === "Z") {
                                    const numberOfRests = note.length
                                    const rests = []
                                    for (let i = 0; i < numberOfRests; i++) {
                                        rests.push({
                                            length: 1,
                                            notes: ["Z"],
                                            position: note.position + i,
                                            chordId: null,
                                            chordName: "",
                                        })
                                    }
                                    return [...noter, ...rests]
                                }
                                return [...noter, note]
                            }, [])
                            .map((chord, i, allChords) => {
                                const highlight = positionArray.includes(
                                    chord.position
                                )
                                return (
                                    <Chord
                                        updatedNoteValues={
                                            updatedBar
                                                ? updatedBar[i]
                                                : undefined
                                        }
                                        barPosition={position}
                                        showChordLetters={showChordLetters}
                                        getChordNameFromMainVoice={
                                            getChordNameFromMainVoice
                                        }
                                        exportMode={exportMode}
                                        showNoteLetters={showNoteLetters}
                                        onMouseLeave={() =>
                                            !barEditMode && setPositionArray([])
                                        }
                                        onMouseEnter={() =>
                                            !barEditMode &&
                                            currentUserHasWriteAccess &&
                                            onMouseEnterChord(
                                                chord,
                                                i,
                                                allChords
                                            )
                                        }
                                        onTouchEnd={() =>
                                            !barEditMode && setPositionArray([])
                                        }
                                        barId={barId}
                                        chord={chord}
                                        highlight={highlight}
                                        key={chord.position}
                                        onContextMenu={handleChordRightClick(
                                            chord.chordId
                                        )}
                                        onClick={() =>
                                            !barEditMode &&
                                            currentUserHasWriteAccess &&
                                            handleChordClick(chord)
                                        }
                                        isSelected={
                                            selectedChord?.chordId ===
                                            chord.chordId
                                        }
                                        handleChordFocus={() =>
                                            !barEditMode &&
                                            handleChordFocus(chord)
                                        }
                                        barEditMode={barEditMode}
                                    />
                                )
                            })}
                    </Box>
                    <RepetitionSign display={repAfter} />
                    <ChordMenu
                        position={chordMenuPosition}
                        onSelect={handleChordMenuSelect}
                    />
                    <BarRightClickMenu
                        barsClipboard={barsClipboard}
                        selectedBars={selectedBars}
                        onSelect={handleBarMenuSelect}
                        position={barMenuPosition}
                    />
                </div>
            </Box>
        </>
    )
}
