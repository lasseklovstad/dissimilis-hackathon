import { IBar } from "./IBar"

export interface IVoice {
    voiceName: string
    voiceNumber: number
    bars: IBar[]
    songVoiceId: number
    songId: number
    isMain: boolean
}

export interface IVoiceDuplicatePost {
    voiceName: string
}

export interface IVoicePost {
    voiceName: string
    voiceNumber: number
}
