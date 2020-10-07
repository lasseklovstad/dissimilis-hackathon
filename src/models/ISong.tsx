import { IVoice } from "./IVoice"

export interface ISong {
    title: string
    songId: number
    // arranger: User;
    voices: IVoice[]
    arrangerId?: number
    denominator: number
    numerator: number
    updatedOn?: string
    arrangerName?: string
}
