import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { useMetronome } from "../../utils/useMetronome.util"

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

export const ChordMenuOptionsContextProvider = (props: {
    children?: ReactNode
}) => {
    const [isPlaying, togglePlay] = useMetronome()
    const [chordMenuOptions, setChordMenuOptions] = useState<IChordMenuOptions>(
        {
            chordLength: 1,
            chord: "C",
            chordType: ChordType.NOTE,
            playMetronome: false,
        }
    )

    useEffect(() => {
        if (chordMenuOptions.playMetronome && !isPlaying) {
            togglePlay()
        }
        if (!chordMenuOptions.playMetronome && isPlaying) {
            togglePlay()
        }
    }, [chordMenuOptions.playMetronome])

    return (
        <ChordMenuOptionsContext.Provider
            value={{ chordMenuOptions, setChordMenuOptions }}
        >
            {props.children}
        </ChordMenuOptionsContext.Provider>
    )
}
