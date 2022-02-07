import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useReducer,
    useState,
} from "react"
import { ISong } from "../../models/ISong"
import { SongAction, songReducer } from "./songReducer"
import { ISelectedBarsPosition } from "../../models/ISelectedBarsPosition"

interface ISongContext {
    song: ISong
    barsClipboard: ISelectedBarsPosition | undefined
    setBarsClipboard: Dispatch<
        SetStateAction<ISelectedBarsPosition | undefined>
    >
    selectedBars: ISelectedBarsPosition | undefined
    setSelectedBars: Dispatch<SetStateAction<ISelectedBarsPosition | undefined>>
}

interface ISongDispatchContext {
    dispatchSong: React.Dispatch<SongAction>
}

const SongDispatchContext = React.createContext<
    ISongDispatchContext | undefined
>(undefined)
const SongContext = React.createContext<ISongContext | undefined>(undefined)

export const SongContextProvider = (props: { children: ReactNode }) => {
    const { children } = props
    const [song, dispatchSong] = useReducer(songReducer, {
        title: "",
        songId: 0,
        denominator: 4,
        numerator: 4,
        voices: [],
        updatedOn: "",
        arrangerName: "",
        currentUserHasWriteAccess: false,
    } as ISong)
    const [barsClipboard, setBarsClipboard] = useState<ISelectedBarsPosition>()

    const [selectedBars, setSelectedBars] = useState<ISelectedBarsPosition>()

    return (
        <SongContext.Provider
            value={{
                song,
                barsClipboard,
                setBarsClipboard,
                selectedBars,
                setSelectedBars,
            }}
        >
            <SongDispatchContext.Provider value={{ dispatchSong }}>
                {children}
            </SongDispatchContext.Provider>
        </SongContext.Provider>
    )
}

export const useSongContext = () => {
    const context = useContext(SongContext)
    if (!context) {
        throw new Error(
            "useSongContext must be used within SongContextProvider"
        )
    }
    return context
}

export const useSongDispatchContext = () => {
    const context = useContext(SongDispatchContext)
    if (!context) {
        throw new Error(
            "useSongDispatchContext must be used within SongDispatchContext"
        )
    }
    return context
}
