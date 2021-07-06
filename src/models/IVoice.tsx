import { IBar } from "./IBar"

export interface IVoice {
    voiceName: string
    partNumber: number
    bars: IBar[]
    songVoiceId: number
    songId: number
    isMain: boolean
}
