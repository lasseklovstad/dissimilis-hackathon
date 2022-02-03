import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"

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
    const [chordMenuOptions, setChordMenuOptions] = useState<IChordMenuOptions>(
        {
            chordLength: 1,
            chord: "C",
            chordType: ChordType.NOTE,
        }
    )

    return (
        <ChordMenuOptionsContext.Provider
            value={{ chordMenuOptions, setChordMenuOptions }}
        >
            {props.children}
        </ChordMenuOptionsContext.Provider>
    )
}
