import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { ISelectedChord } from "../../models/ISelectedChord"
import { useChordMenuOptionsContext } from "../chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useSongContext } from "../song/SongContextProvider.component"
import { useUpdateChord } from "../../utils/useApiServiceSongs"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { ISong } from "../../models/ISong"

interface ISelectedChordContext {
    selectedChord: ISelectedChord | null
    setSelectedChord: Dispatch<SetStateAction<ISelectedChord | null>>
    updateSelectedChord: (options: IChordMenuOptions) => Promise<void>
}

const SelectedChordContext = createContext<ISelectedChordContext | undefined>(
    undefined
)

export const useSelectedChordContext = () => {
    const selectedChordContext = useContext(SelectedChordContext)
    if (!selectedChordContext) {
        throw new Error(
            "useSelectedChordContext must be used within SelectedChordContext"
        )
    }
    return selectedChordContext
}

export const useSelectedChordAsChord = (
    selectedChord: ISelectedChord | null,
    song: ISong
) => {
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

export const SelectedChordContextProvider = (props: {
    children?: ReactNode
}) => {
    const [selectedChord, setSelectedChord] = useState<ISelectedChord | null>(
        null
    )
    const { dispatchSong, song } = useSongContext()
    const selectedChordAsChord = useSelectedChordAsChord(selectedChord, song)
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
            const { error, result } = await updateChord.run(selectedChord, body)
            if (!error && result) {
                dispatchSong({ type: "UPDATE_BAR", bar: result.data })
            }
        }
    }

    return (
        <SelectedChordContext.Provider
            value={{ selectedChord, setSelectedChord, updateSelectedChord }}
        >
            {props.children}
        </SelectedChordContext.Provider>
    )
}
