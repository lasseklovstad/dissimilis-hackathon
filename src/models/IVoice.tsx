import { IBar } from "./IBar"

export interface IVoice {
    title: string
    partNumber: number
    bars: IBar[]
    songVoiceId?: number
    songId?: number
    isMain: boolean
}
