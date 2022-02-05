import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react"
import { ISelectedChord } from "../../models/ISelectedChord"
import { IBar } from "../../models/IBar"
import { useSelectedChordAsChord } from "./useSelectedChordAsChord"
import { useSongContext } from "../song/SongContextProvider.component"
import { IChord } from "../../models/IChord"

interface ISelectedChordContext {
    selectedChord: ISelectedChord | null
    selectedChordAsChord: IChord | null // The current selected chord as a IChord
    selectedChordBar: IBar | null // The bar the selected chord lives inside
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
    const [selectedChord, setSelectedChord] = useState<ISelectedChord | null>(
        null
    )
    const { song } = useSongContext()
    const { chord: selectedChordAsChord, bar: selectedChordBar } =
        useSelectedChordAsChord(selectedChord, song)

    return (
        <SelectedChordContext.Provider
            value={{
                selectedChord,
                setSelectedChord,
                selectedChordAsChord,
                selectedChordBar,
            }}
        >
            {props.children}
        </SelectedChordContext.Provider>
    )
}
