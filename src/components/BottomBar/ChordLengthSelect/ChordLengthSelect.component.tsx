import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { FormControl, MenuItem, Select } from "@mui/material"
import { ReactComponent as WholenoteIcon } from "../../../assets/images/icon_whole-note.svg"
import { ReactComponent as HalfnoteDottedIcon } from "../../../assets/images/icon_half-note-dotted.svg"
import { ReactComponent as HalfnoteIcon } from "../../../assets/images/icon_half-note.svg"
import { ReactComponent as QuarternoteDottedIcon } from "../../../assets/images/icon_quarter-note-dotted.svg"
import { ReactComponent as QuarternoteIcon } from "../../../assets/images/icon_quarter-note.svg"
import { ReactComponent as EighthnoteIcon } from "../../../assets/images/icon_eighth-note.svg"
import { IChordMenuOptions } from "../../../models/IChordMenuOptions"
import { ISong } from "../../../models/ISong"

const noteLengths = [
    {
        length: 8,
        Icon: WholenoteIcon,
        label: "BottomBar.wholeNote",
    },
    {
        length: 6,
        Icon: HalfnoteDottedIcon,
        label: "BottomBar.halfNoteDotted",
    },
    {
        length: 4,
        Icon: HalfnoteIcon,
        label: "BottomBar.halfNote",
    },
    {
        length: 3,
        Icon: QuarternoteDottedIcon,
        label: "BottomBar.quarterNoteDotted",
    },
    {
        length: 2,
        Icon: QuarternoteIcon,
        label: "BottomBar.quarterNote",
    },
    {
        length: 1,
        Icon: EighthnoteIcon,
        label: "BottomBar.eighthNote",
    },
]

type ChordLengthSelectProps = {
    chordMenuOptions: IChordMenuOptions
    onChordMenuOptionChange: (
        chordMenuOptions: IChordMenuOptions
    ) => Promise<void>
    song: Pick<ISong, "denominator" | "numerator">
}

export const ChordLengthSelect = ({
    chordMenuOptions,
    onChordMenuOptionChange,
    song: { numerator, denominator },
}: ChordLengthSelectProps) => {
    const { t } = useTranslation()
    // This container is used so that the Menu og the select is inside the Click-listener and not placed on the body.
    const container = useRef(null)

    const timeSignatureLength = denominator === 4 ? numerator * 2 : numerator

    const handleChangeChordLength = (chordLength: number) => {
        onChordMenuOptionChange({ ...chordMenuOptions, chordLength })
    }
    return (
        <>
            <div ref={container} />
            <FormControl
                variant="outlined"
                size="small"
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
                    labelId="selectChordLengthLabel"
                    id="selectChordLength"
                    fullWidth
                    value={chordMenuOptions.chordLength}
                    onChange={(event) => {
                        handleChangeChordLength(event.target.value as number)
                    }}
                    MenuProps={{ container: container.current }}
                >
                    {noteLengths
                        .filter(({ length }) => length <= timeSignatureLength)
                        .map(({ length, Icon, label }) => {
                            return (
                                <MenuItem
                                    value={length}
                                    key={length}
                                    aria-label={t(label)}
                                >
                                    <Icon title={t(label)} />
                                </MenuItem>
                            )
                        })}
                </Select>
            </FormControl>
        </>
    )
}
