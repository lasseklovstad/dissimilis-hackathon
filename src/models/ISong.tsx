import { IVoice } from "./IVoice"

export interface ISong {
    title: string
    songId: number
    voices: IVoice[]
    denominator: number
    numerator: number
    updatedOn: string
    arrangerName: string | null
}

export interface ISongIndex {
    songId: number
    title: string
    numerator: number
    denominator: number
    arrangerEmail: string
    updatedOn: string
}

export interface ISongPost {
    denominator: number
    numerator: number
    title: string
}
