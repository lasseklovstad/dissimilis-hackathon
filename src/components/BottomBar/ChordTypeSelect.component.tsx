import ToggleButton from "@mui/material/ToggleButton"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import React from "react"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"

type ChordTypeSelectProps = {
    chordMenuOptions: IChordMenuOptions
    onChordMenuOptionChange: (
        chordMenuOptions: IChordMenuOptions
    ) => Promise<void>
}

export const ChordTypeSelect = ({
    chordMenuOptions,
    onChordMenuOptionChange,
}: ChordTypeSelectProps) => {
    const { t } = useTranslation()
    const handleToggle = async (
        event: React.MouseEvent<HTMLElement>,
        chordType: ChordType | null
    ) => {
        if (chordType) {
            if (chordType === ChordType.CHORD) {
                onChordMenuOptionChange({ ...chordMenuOptions, chordType })
            } else {
                const noteFromChord = chordMenuOptions.chord.includes("#")
                    ? chordMenuOptions!!.chord.substring(0, 2)
                    : chordMenuOptions!!.chord?.charAt(0)

                onChordMenuOptionChange({
                    ...chordMenuOptions,
                    chordType,
                    chord: noteFromChord,
                })
            }
        }
    }
    return (
        <ToggleButtonGroup
            sx={{ borderRadius: 0 }}
            value={chordMenuOptions.chordType}
            exclusive
            onChange={handleToggle}
            size="large"
        >
            <ToggleButton
                sx={{
                    border: 0,
                    borderRadius: 0,
                    "&:focus": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                }}
                value={ChordType.CHORD}
                disableFocusRipple
            >
                {t("BottomBar.chord")}
            </ToggleButton>
            <ToggleButton
                sx={{
                    border: 0,
                    borderRadius: 0,
                    "&:focus": {
                        boxShadow: `0 0 0 4px ${colors.focus}`,
                    },
                }}
                value={ChordType.NOTE}
                disableFocusRipple
            >
                {t("BottomBar.note")}
            </ToggleButton>
        </ToggleButtonGroup>
    )
}
