export interface IChordAndNotes {
    position: number
    notes: string[]
    length: number
    noteId: number | null
}

export interface IBar {
    barId: number
    songId: number
    songVoiceId: number
    position: number
    house?: number | undefined | null
    repBefore: boolean
    repAfter: boolean
    chordsAndNotes: IChordAndNotes[]
}
