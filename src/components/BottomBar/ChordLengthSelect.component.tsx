import React, { useRef } from "react"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useTranslation } from "react-i18next"
import { useUpdateSelectedChord } from "../../context/selectedChord/useUpdateSelectedChord"
import { FormControl, MenuItem, Select, SvgIcon } from "@mui/material"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { ReactComponent as WholenoteIcon } from "../../assets/images/icon_whole-note.svg"
import { ReactComponent as HalfnoteDottedIcon } from "../../assets/images/icon_half-note-dotted.svg"
import { ReactComponent as HalfnoteIcon } from "../../assets/images/icon_half-note.svg"
import { ReactComponent as QuarternoteDottedIcon } from "../../assets/images/icon_quarter-note-dotted.svg"
import { ReactComponent as QuarternoteIcon } from "../../assets/images/icon_quarter-note.svg"
import { ReactComponent as EighthnoteIcon } from "../../assets/images/icon_eighth-note.svg"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"

const noteLengths = [
    {
        length: 8,
        Icon: <WholenoteIcon />,
        label: "BottomBar.wholeNote",
    },
    {
        length: 6,
        Icon: <HalfnoteDottedIcon />,
        label: "BottomBar.halfNoteDotted",
    },
    {
        length: 4,
        Icon: <HalfnoteIcon />,
        label: "BottomBar.halfNote",
    },
    {
        length: 3,
        Icon: <QuarternoteDottedIcon />,
        label: "BottomBar.quarterNoteDotted",
    },
    {
        length: 2,
        Icon: <QuarternoteIcon />,
        label: "BottomBar.quarterNote",
    },
    {
        length: 1,
        Icon: <EighthnoteIcon />,
        label: "BottomBar.eighthNote",
    },
]

export const ChordLengthSelect = () => {
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const { t } = useTranslation()
    const { selectedChord, selectedChordAsChord } = useSelectedChordContext()
    const { updateSelectedChord } = useUpdateSelectedChord({
        selectedChord,
        selectedChordAsChord,
    })
    // This container is used so that the Menu og the select is inside the Click-listener and not placed on the body.
    const container = useRef(null)
    const {
        song: { numerator, denominator },
    } = useSongContext()

    const timeSignatureNumerator = denominator === 4 ? numerator * 2 : numerator

    const handleChangeChordLength = async (chordLength: number) => {
        const newOptions = { ...chordMenuOptions, chordLength }
        if (selectedChord) {
            const response = await updateSelectedChord(newOptions)
            if (response && response.error) {
                // Selected Chord has tried to update but failed
                return
            }
        }
        setChordMenuOptions(newOptions)
    }
    return (
        <>
            <div ref={container} />
            <FormControl
                variant="outlined"
                size={"small"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    pl: 1,
                    border: 0,
                    "& .MuiOutlinedInput-notchedOutline": { border: "0px" },
                    width: "100px",
                }}
            >
                <label id="selectChordLengthLabel" hidden>
                    {t("BottomBar.noteLength")}
                </label>
                <Select
                    labelId={"selectChordLengthLabel"}
                    id={"selectChordLength"}
                    fullWidth
                    value={chordMenuOptions?.chordLength}
                    onChange={(event) => {
                        handleChangeChordLength(event.target.value as number)
                    }}
                    MenuProps={{ container: container.current }}
                >
                    {noteLengths
                        .filter(({ length }) => length < timeSignatureNumerator)
                        .map(({ length, Icon, label }) => {
                            return (
                                <MenuItem
                                    value={length}
                                    key={length}
                                    aria-label={t(label)}
                                >
                                    <SvgIcon>{Icon}</SvgIcon>
                                </MenuItem>
                            )
                        })}
                </Select>
            </FormControl>
        </>
    )
}
