import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { useSongContext } from "../song/SongContextProvider.component"
import { useSelectedChordContext } from "../selectedChord/SelectedChordContextProvider.component"

interface IChordMenuOptionsContext {
    chordMenuOptions: IChordMenuOptions
    setChordMenuOptions: Dispatch<SetStateAction<IChordMenuOptions>>
}

const ChordMenuOptionsContext = createContext<
    IChordMenuOptionsContext | undefined
>(undefined)

export const useChordMenuOptionsContext = () => {
    const context = useContext(ChordMenuOptionsContext)
    if (!context) {
        throw new Error(
            "useChordMenuOptionsContext must be used within ChordMenuOptionsContext"
        )
    }
    return context
}

export const useSelectedChord = () => {
    const { song } = useSongContext()
    const { selectedChord } = useSelectedChordContext()
    const chord = useMemo(() => {
        if (selectedChord) {
            const voice = song.voices.find(
                (v) => v.songVoiceId === selectedChord.voiceId
            )
            const bar = voice?.bars.find((b) => b.barId === selectedChord.barId)
            const chordRes = bar?.chords.find(
                (c) => c.chordId === selectedChord.chordId
            )
            return chordRes || null
        }
        return null
    }, [selectedChord, song.voices])
    return chord
}

export const ChordMenuOptionsContextProvider = (props: {
    children?: ReactNode
}) => {
    const selectedChord = useSelectedChord()
    const [chordMenuOptions, setChordMenuOptions] = useState<IChordMenuOptions>(
        {
            chordLength: 1,
            chord: "C",
            chordType: ChordType.NOTE,
        }
    )

    useEffect(() => {
        if (selectedChord) {
            setChordMenuOptions((options) => {
                if (selectedChord) {
                    return {
                        chordLength: selectedChord.length,
                        chord:
                            selectedChord.chordName || selectedChord.notes[0],
                        chordNotes: selectedChord.notes,
                        chordType:
                            selectedChord.notes.length > 1
                                ? ChordType.CHORD
                                : ChordType.NOTE,
                    }
                }
                return options
            })
        }
    }, [selectedChord])

    return (
        <ChordMenuOptionsContext.Provider
            value={{ chordMenuOptions, setChordMenuOptions }}
        >
            {props.children}
        </ChordMenuOptionsContext.Provider>
    )
}
