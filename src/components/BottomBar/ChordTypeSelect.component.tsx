import ToggleButton from "@mui/material/ToggleButton"
import { ChordType } from "../../models/IChordMenuOptions"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import React from "react"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { useUpdateSelectedChord } from "../../context/selectedChord/useUpdateSelectedChord"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"

export const ChordTypeSelect = () => {
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const { selectedChord, selectedChordAsChord } = useSelectedChordContext()
    const { t } = useTranslation()
    const { updateSelectedChord } = useUpdateSelectedChord({
        selectedChord,
        selectedChordAsChord,
    })
    const handleToggle = async (
        event: React.MouseEvent<HTMLElement>,
        chordType: ChordType | null
    ) => {
        if (chordType) {
            if (chordType === ChordType.CHORD) {
                const newOptions = { ...chordMenuOptions, chordType }
                if (selectedChord) {
                    await updateSelectedChord(newOptions)
                }
                setChordMenuOptions(newOptions)
            } else {
                const noteFromChord = chordMenuOptions.chord.includes("#")
                    ? chordMenuOptions!!.chord.substring(0, 2)
                    : chordMenuOptions!!.chord?.charAt(0)
                const newOptions = {
                    ...chordMenuOptions,
                    chordType,
                    chord: noteFromChord,
                }
                if (selectedChord) {
                    await updateSelectedChord(newOptions)
                }
                setChordMenuOptions(newOptions)
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
