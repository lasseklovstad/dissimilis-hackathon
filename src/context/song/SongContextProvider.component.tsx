import React, { ReactNode, useContext, useReducer, useState } from "react"
import { ISong } from "../../models/ISong"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import {
    ChordMenuAction,
    chordMenuReducer,
} from "../../views/SongView/ChordMenuOptions.component"
import { SongAction, songReducer } from "./songReducer"

interface ISongContext {
    song: ISong
    dispatchSong: React.Dispatch<SongAction>
    chordMenuOptions: IChordMenuOptions
    dispatchChordMenuOptions: React.Dispatch<ChordMenuAction>
    barEditMode: boolean
    setBarEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setCustomMode: React.Dispatch<React.SetStateAction<boolean>>
    customMode: boolean
    barsClipboard:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    setBarsClipboard: React.Dispatch<
        React.SetStateAction<
            | {
                  fromPosition: number
                  toPosition: number
              }
            | undefined
        >
    >
    selectedBars:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    setSelectedBars: React.Dispatch<
        React.SetStateAction<
            | {
                  fromPosition: number
                  toPosition: number
              }
            | undefined
        >
    >
}

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
    } as ISong)
    const [chordMenuOptions, dispatchChordMenuOptions] = useReducer(
        chordMenuReducer,
        {
            chordLength: 1,
            chord: "C",
            chordType: ChordType.NOTE,
            chordNotes: ["C"],
        }
    )
    const [barEditMode, setBarEditMode] = useState(false)
    const [barsClipboard, setBarsClipboard] = useState<
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    >(undefined)

    const [selectedBars, setSelectedBars] = useState<
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    >(undefined)


    const [customMode, setCustomMode] = useState(false)

    return (
        <SongContext.Provider
            value={{
                song,
                dispatchSong,
                chordMenuOptions,
                dispatchChordMenuOptions,
                barEditMode,
                setBarEditMode,
                barsClipboard,
                setBarsClipboard,
                selectedBars,
                setSelectedBars,
                customMode,
                setCustomMode,
            }}
        >
            {children}
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
