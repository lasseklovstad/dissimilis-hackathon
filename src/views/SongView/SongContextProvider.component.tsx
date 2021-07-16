import React, {
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react"
import { ISong } from "../../models/ISong"
import { IBar } from "../../models/IBar"
import { IVoice } from "../../models/IVoice"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { ChordMenuAction, chordMenuReducer } from "./ChordMenuOptions.component"
import { useVoice } from "../../utils/useVoice"

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
                                house: actionBar.house,
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
    song: ISong
    dispatchSong: React.Dispatch<SongAction>
    chordMenuOptions: IChordMenuOptions
    dispatchChordMenuOptions: React.Dispatch<ChordMenuAction>
    barEditMode: boolean
    setBarEditMode: React.Dispatch<React.SetStateAction<boolean>>
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
    voices: IVoice[]
    selectedVoiceId: number | undefined
    selectedVoice: IVoice | undefined
    setSelectedVoice: React.Dispatch<React.SetStateAction<IVoice | undefined>>
    selectedBarId: number | undefined
    selectedChordId: number | undefined | null
    selectedChordPosition: number
    setValuesForSelectedChord: (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => void
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

    const { voices } = song
    const selectedVoiceId = useVoice(voices)
    const [selectedVoice, setSelectedVoice] = useState<IVoice | undefined>(
        voices.find((voice) => voice.songVoiceId === selectedVoiceId)
    )
    const [selectedBarId, setSelectedBarId] = useState<number | undefined>(
        undefined
    )
    const [selectedChordId, setSelectedChordId] = useState<
        number | undefined | null
    >(undefined)
    const [selectedChordPosition, setSelectedChordPosition] =
        useState<number>(0)

    const setValuesForSelectedChord = (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => {
        setSelectedChordId(chordId)
        setSelectedBarId(barId)
        setSelectedChordPosition(position)
    }

    useEffect(() => {
        setSelectedVoice(
            song.voices.find((voice) => voice.songVoiceId === selectedVoiceId)
        )
    }, [song, selectedVoiceId])

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
                voices,
                selectedVoiceId,
                selectedVoice,
                setSelectedVoice,
                selectedBarId,
                selectedChordId,
                selectedChordPosition,
                setValuesForSelectedChord,
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
