export interface IChord {
    position: number
    notes: string[]
    length: number
    chordId: number | null
    activeChord: string
}

export interface IBar {
    barId: number
    songId: number
    songVoiceId: number
    position: number
    house?: number | undefined | null
    repBefore: boolean
    repAfter: boolean
    chords: IChord[]
}
