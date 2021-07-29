import React, { ReactNode, useContext, useReducer, useState } from "react"
import { ISong } from "../../models/ISong"
import { IBar } from "../../models/IBar"
import { IVoice } from "../../models/IVoice"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { ChordMenuAction, chordMenuReducer } from "./ChordMenuOptions.component"

export type SongAction =
    | { type: "ADD_BAR"; bar: IBar }
    | { type: "DELETE_BAR"; barPosition: number }
    | { type: "UPDATE_BAR"; bar: IBar }
    | { type: "UPDATE_VOICE"; voice: IVoice }
    | { type: "DELETE_VOICE"; songVoiceId: number }
    | { type: "ADD_VOICE"; voice: IVoice }
    | { type: "UPDATE_SONG"; song: ISong }
    | { type: "UPDATE_VOICE_NAME"; voice: IVoice }

export const songReducer = (song: ISong, action: SongAction) => {
    switch (action.type) {
        case "UPDATE_SONG":
            return action.song
        case "ADD_BAR":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return {
                        ...voice,
                        bars: [...voice.bars, action.bar],
                    }
                }),
            }
        case "DELETE_BAR":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return {
                        ...voice,
                        bars: voice.bars.filter(
                            (bar) => bar.position !== action.barPosition
                        ),
                    }
                }),
            }
        case "UPDATE_BAR":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return voice.songVoiceId === action.bar.songVoiceId
                        ? {
                              ...voice,
                              bars: voice.bars.map((bar) => {
                                  return bar.barId === action.bar.barId
                                      ? action.bar
                                      : bar
                              }),
                          }
                        : voice
                }),
            }
        case "UPDATE_VOICE":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return {
                        ...voice,
                        bars: voice.bars.map((bar, index) => {
                            const actionBar = action.voice.bars[index]
                            return {
                                ...bar,
                                voltaBracket: actionBar.voltaBracket,
                                repAfter: actionBar.repAfter,
                                repBefore: actionBar.repBefore,
                            }
                        }),
                    }
                }),
            }
        case "UPDATE_VOICE_NAME":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return voice.songVoiceId === action.voice.songVoiceId
                        ? action.voice
                        : voice
                }),
            }
        case "ADD_VOICE":
            return {
                ...song,
                voices: [...song.voices, action.voice],
            }
        case "DELETE_VOICE":
            return {
                ...song,
                voices: song.voices.filter(
                    (voice) => voice.songVoiceId !== action.songVoiceId
                ),
            }
        default:
            return song
    }
}

interface ISongContext {
    song: ISong | undefined
    dispatchSong: React.Dispatch<SongAction>
    chordMenuOptions: IChordMenuOptions | undefined
    dispatchChordMenuOptions: React.Dispatch<ChordMenuAction>
    barEditMode: boolean
    setBarEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setCustomMode: React.Dispatch<React.SetStateAction<boolean>>
    customMode: boolean | undefined
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
    selectedVoice: IVoice | undefined
    setSelectedVoice: React.Dispatch<React.SetStateAction<IVoice | undefined>>
    selectedBarId: number | undefined
    selectedChordId: number | undefined | null
    selectedChordPosition: number | undefined
    setValuesForSelectedChord: (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => void
}

const SongContext = React.createContext<ISongContext>({
    song: undefined,
    dispatchSong: () => {
        throw new Error("dispatchSong is not implemented")
    },
    chordMenuOptions: undefined,
    dispatchChordMenuOptions: () => {
        throw new Error("dispatchChordMenuOptions is not implemented")
    },
    barEditMode: false,
    setBarEditMode: () => {
        throw new Error("setBarEditMode is not implemented")
    },
    barsClipboard: undefined,
    setBarsClipboard: () => {
        throw new Error("setBarsClipboard is not implemented")
    },
    selectedBars: undefined,
    setSelectedBars: () => {
        throw new Error("setSelectedBars is not implemented")
    },
    selectedVoice: undefined,
    setSelectedVoice: () => {
        throw new Error("setSelectedVoiceId is not implemented")
    },
    selectedBarId: undefined,
    selectedChordId: undefined,
    selectedChordPosition: undefined,
    setValuesForSelectedChord: () => {
        throw new Error("setValuesForSelectedChord is not implemented")
    },
    customMode: undefined,
    setCustomMode: () => {
        throw new Error("setValuesForSelectedChord is not implemented")
    },
})

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
    const [selectedVoice, setSelectedVoice] = useState<IVoice | undefined>(
        undefined
    )
    const [selectedBarId, setSelectedBarId] = useState<number | undefined>(
        undefined
    )
    const [selectedChordId, setSelectedChordId] = useState<
        number | undefined | null
    >(undefined)
    const [selectedChordPosition, setSelectedChordPosition] =
        useState<number>(0)

    const [customMode, setCustomMode] = useState(false)

    const setValuesForSelectedChord = (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => {
        setSelectedChordId(chordId)
        setSelectedChordPosition(position)
        setSelectedBarId(barId)
    }
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
                selectedVoice,
                setSelectedVoice,
                selectedBarId,
                selectedChordId,
                selectedChordPosition,
                setValuesForSelectedChord,
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
