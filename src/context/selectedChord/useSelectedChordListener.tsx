import { useChordMenuOptionsContext } from "../chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useEffect } from "react"
import { ChordType } from "../../models/IChordMenuOptions"
import { useSelectedChordContext } from "./SelectedChordContextProvider.component"

export const useSelectedChordListener = () => {
    const { selectedChordAsChord } = useSelectedChordContext()
    const { setChordMenuOptions } = useChordMenuOptionsContext()
    useEffect(() => {
        if (selectedChordAsChord) {
            setChordMenuOptions((options) => {
                if (selectedChordAsChord) {
                    return {
                        chordLength: selectedChordAsChord.length,
                        chord:
                            selectedChordAsChord.chordName ||
                            selectedChordAsChord.notes[0],
                        chordType:
                            selectedChordAsChord.chordName !== null
                                ? ChordType.CHORD
                                : ChordType.NOTE,
                    }
                }
                return options
            })
        }
    }, [selectedChordAsChord, setChordMenuOptions])
}
