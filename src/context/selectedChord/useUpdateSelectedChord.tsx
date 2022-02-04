import { useUpdateChord } from "../../utils/useApiServiceSongs"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { useSelectedChordContext } from "./SelectedChordContextProvider.component"
import { useSongDispatchContext } from "../song/SongContextProvider.component"

export const useUpdateSelectedChord = () => {
    const { selectedChord, selectedChordAsChord } = useSelectedChordContext()
    const { dispatchSong } = useSongDispatchContext()
    const { updateChord } = useUpdateChord()

    const updateSelectedChord = async (chordMenuOptions: IChordMenuOptions) => {
        if (selectedChord && selectedChordAsChord) {
            const body =
                chordMenuOptions.chordType === ChordType.CHORD
                    ? {
                          position: selectedChordAsChord.position,
                          length: chordMenuOptions.chordLength,
                          notes: null,
                          chordName: chordMenuOptions.chord,
                      }
                    : {
                          position: selectedChordAsChord.position,
                          length: chordMenuOptions.chordLength,
                          notes: [chordMenuOptions.chord],
                          chordName: null,
                      }
            const response = await updateChord.run(selectedChord, body)
            if (!response.error && response.result) {
                dispatchSong({ type: "UPDATE_BAR", bar: response.result.data })
            }
            return response
        }
        return null
    }

    return { updateSelectedChord }
}
