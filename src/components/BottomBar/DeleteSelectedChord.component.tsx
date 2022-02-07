import { Delete } from "@mui/icons-material"
import { Button } from "@mui/material"
import React from "react"
import { useDeleteChord } from "../../utils/useApiServiceSongs"
import { useTranslation } from "react-i18next"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { useSongDispatchContext } from "../../context/song/SongContextProvider.component"

export const DeleteSelectedChord = () => {
    const { selectedChord, setSelectedChord } = useSelectedChordContext()
    const { dispatchSong } = useSongDispatchContext()
    const { deleteChord } = useDeleteChord()
    const { t } = useTranslation()

    if (!selectedChord) {
        return null
    }

    const handleDeleteSelectedChord = async () => {
        const { error, result } = await deleteChord.run(selectedChord)
        if (!error && result) {
            setSelectedChord(null)
            dispatchSong({ type: "UPDATE_BAR", bar: result.data })
        }
    }

    return (
        <Button
            disableFocusRipple
            onClick={handleDeleteSelectedChord}
            aria-label={t("BottomBar.deleteSelectedChord")}
        >
            <Delete />
        </Button>
    )
}
