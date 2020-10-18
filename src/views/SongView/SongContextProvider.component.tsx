import React from "react"
import { ISong } from "../../models/ISong"
import { IBar } from "../../models/IBar"
import { IVoice } from "../../models/IVoice"

type SongAction =
    | { type: "ADD_BAR"; bars: IBar[] }
    | { type: "UPDATE_BAR"; bar: IBar }
    | { type: "UPDATE_VOICE"; voice: IVoice }
    | { type: "DELETE_VOICE"; voice: IVoice }
    | { type: "ADD_VOICE"; voice: IVoice }
    | { type: "UPDATE_SONG"; song: ISong }

export const songReducer = (song: ISong, action: SongAction) => {
    switch (action.type) {
        case "UPDATE_SONG":
            return action.song
        case "ADD_BAR":
            return {
                ...song,
                voices: song.voices.map((voice) => {
                    return { ...voice, bars: action.bars }
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
                    (voice) => voice.songVoiceId !== action.voice.songVoiceId
                ),
            }
        default:
            return song
    }
}

interface ISongContext {
    dispatchSong: React.Dispatch<SongAction>
    selectedChord: string
    selectedNoteLength: number
    isNoteSelected: boolean
}

export const SongContext = React.createContext<ISongContext>({
    dispatchSong: () => {
        throw new Error("dispatchSong is not implemented")
    },
    selectedChord: "C",
    selectedNoteLength: 1,
    isNoteSelected: true,
})
