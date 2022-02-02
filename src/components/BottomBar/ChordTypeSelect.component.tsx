import ToggleButton from "@mui/material/ToggleButton"
import { ChordType } from "../../models/IChordMenuOptions"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import React from "react"
import {
    useChordMenuOptionsContext,
    useSelectedChord,
} from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { useUpdateChord } from "../../utils/useApiServiceSongs"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { useSongContext } from "../../context/song/SongContextProvider.component"

export const ChordTypeSelect = () => {
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const { selectedChord } = useSelectedChordContext()
    const { dispatchSong } = useSongContext()
    const selectedChordAsChord = useSelectedChord()
    const { t } = useTranslation()
    const { updateChord } = useUpdateChord()
    const handleToggle = async (
        event: React.MouseEvent<HTMLElement>,
        chordType: ChordType | null
    ) => {
        if (chordType) {
            if (selectedChord && selectedChordAsChord) {
                if (chordType === ChordType.CHORD) {
                    const body = {
                        position: selectedChordAsChord.position,
                        length: selectedChordAsChord.length,
                        notes: null,
                        chordName: chordMenuOptions.chord,
                    }
                    const { error, result } = await updateChord.run(
                        selectedChord,
                        body
                    )
                    if (!error && result) {
                        dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                    }
                } else {
                    const noteFromChord = chordMenuOptions.chord.includes("#")
                        ? chordMenuOptions!!.chord.substring(0, 2)
                        : chordMenuOptions!!.chord?.charAt(0)
                    const body = {
                        position: selectedChordAsChord.position,
                        length: selectedChordAsChord.length,
                        notes: [noteFromChord],
                        chordName: null,
                    }
                    const { error, result } = await updateChord.run(
                        selectedChord,
                        body
                    )
                    if (!error && result) {
                        dispatchSong({ type: "UPDATE_BAR", bar: result.data })
                    }
                }
            } else {
                setChordMenuOptions((options) => ({ ...options, chordType }))
            }
        }
    }
    return (
        <ToggleButtonGroup
            sx={{ borderRadius: 0 }}
            value={chordMenuOptions.chordType}
            exclusive
            onChange={handleToggle}
            size={"large"}
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
