import { IChord } from "./IChord"

export interface IBar {
    barId: number
    songId: number
    songVoiceId: number
    position: number
    voltaBracket: number | null
    repBefore: boolean
    repAfter: boolean
    chords: IChord[]
}
