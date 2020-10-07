export interface IChordAndNotes {
    noteNumber?: number
    notes: string[]
    length: number
}

export interface IBar {
    barId?: number
    songId: number
    songVoiceId?: number
    barNumber: number
    house?: number | undefined | null
    repBefore: boolean
    repAfter: boolean
    chordsAndNotes: IChordAndNotes[]
}
