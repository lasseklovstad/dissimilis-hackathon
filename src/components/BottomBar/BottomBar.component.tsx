import { Box, ClickAwayListener, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAddBar } from "../../utils/useApiServiceSongs"
import {
    useSongContext,
    useSongDispatchContext,
} from "../../context/song/SongContextProvider.component"
import { SelectedChordIntervals } from "./SelectedChordIntervals.component"
import { useSelectedChordContext } from "../../context/selectedChord/SelectedChordContextProvider.component"
import { DeleteSelectedChord } from "./DeleteSelectedChord.component"
import { ChordTypeSelect } from "./ChordTypeSelect.component"
import { ChordLengthSelect } from "./ChordLengthSelect/ChordLengthSelect.component"
import { AddBarButton } from "./AddBarButton"
import { ChordNameAutocomplete } from "./ChordNameAutocomplete"
import { useUpdateSelectedChord } from "../../context/selectedChord/useUpdateSelectedChord"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { IChordMenuOptions } from "../../models/IChordMenuOptions"

type BottomBarProps = {
    voiceId: number
    songId: number
}

export const BottomBar = (props: BottomBarProps) => {
    const { voiceId, songId } = props
    const { dispatchSong } = useSongDispatchContext()
    const { song } = useSongContext()
    const { t } = useTranslation()
    const {
        setSelectedChord,
        selectedChord,
        selectedChordAsChord,
        selectedChordBar,
    } = useSelectedChordContext()
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const { updateSelectedChord } = useUpdateSelectedChord({
        selectedChord,
        selectedChordAsChord,
    })
    const { postBar } = useAddBar(songId, voiceId)

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight)
    }

    const handleAddBar = async () => {
        const { error, result } = await postBar.run()
        if (!error && result) {
            dispatchSong({ type: "UPDATE_SONG", song: result.data })
            scrollToBottom()
        }
    }

    const clickOutsideListener = (e: any) => {
        if (e.target.id !== "chordButton" && e.target.id !== "singleChord") {
            setSelectedChord(null)
        }
    }

    const handleChangeMenuOptionChange = async (
        newOptions: IChordMenuOptions
    ) => {
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
        <ClickAwayListener onClickAway={clickOutsideListener}>
            <Box
                sx={{
                    width: "100%",
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    pl: 3,
                    pr: 3,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >
                <Paper
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        m: 1,
                        flexGrow: 0,
                    }}
                    elevation={6}
                >
                    <ChordLengthSelect
                        chordMenuOptions={chordMenuOptions}
                        onChordMenuOptionChange={handleChangeMenuOptionChange}
                        song={song}
                    />
                    <ChordNameAutocomplete
                        chordMenuOptions={chordMenuOptions}
                        onChordMenuOptionChange={handleChangeMenuOptionChange}
                    />
                    <ChordTypeSelect
                        chordMenuOptions={chordMenuOptions}
                        onChordMenuOptionChange={handleChangeMenuOptionChange}
                    />
                    <DeleteSelectedChord />
                </Paper>

                {selectedChord && selectedChordAsChord && selectedChordBar && (
                    <SelectedChordIntervals
                        selectedChord={selectedChord}
                        selectedChordAsChord={selectedChordAsChord}
                        selectedChordBar={selectedChordBar}
                    />
                )}
                <AddBarButton
                    text={t("BottomBar.addBar")}
                    onClick={handleAddBar}
                />
            </Box>
        </ClickAwayListener>
    )
}
