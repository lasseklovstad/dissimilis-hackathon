import React from "react"
import { ISong } from "../../models/ISong"
import { IBar } from "../../models/IBar"
import { IVoice } from "../../models/IVoice"
import { ChordType, IChordMenuOptions } from "../../models/IChordMenuOptions"
import { ChordMenuAction } from "./ChordMenuOptions.component"

type SongAction =
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
    dispatchSong: React.Dispatch<SongAction>
    dispatchChordMenuOptions: React.Dispatch<ChordMenuAction>
    chordMenuOptions: IChordMenuOptions
    setValuesForSelectedChord: (
        chordId: number | undefined | null,
        barId: number | undefined,
        position: number
    ) => void
    selectedChordId: number | undefined | null
}

export const SongContext = React.createContext<ISongContext>({
    dispatchSong: () => {
        throw new Error("dispatchSong is not implemented")
    },
    chordMenuOptions: {
        chordLength: 1,
        chord: "C",
        chordType: ChordType.NOTE,
    },
    setValuesForSelectedChord: () => {
        throw new Error("setValuesForSelectedChord is not implemented")
    },
    dispatchChordMenuOptions: () => {
        throw new Error("dispatchChordMenuOptions is not implemented")
    },
    selectedChordId: undefined,
})
