import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react"
import { ISelectedChord } from "../../models/ISelectedChord"

interface ISelectedChordContext {
    selectedChord: ISelectedChord | null
    setSelectedChord: Dispatch<SetStateAction<ISelectedChord | null>>
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

export const SelectedChordContextProvider = (props: {
    children?: ReactNode
}) => {
    const [selectedChord, setSelectedChord] = useState<ISelectedChord | null>(null)
    return (
        <SelectedChordContext.Provider
            value={{ selectedChord, setSelectedChord }}
        >
            {props.children}
        </SelectedChordContext.Provider>
    )
}
