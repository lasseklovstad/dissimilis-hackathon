import { IBar } from "./IBar"

export interface IVoice {
    title: string
    partNumber: number
    bars: Array<IBar>
    id?: number
    songId?: number
}
