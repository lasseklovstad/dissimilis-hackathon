export interface IChord {
    position: number
    notes: string[]
    length: number
    chordId: number | null
    chordName: string | null
    selectedNotes?: string [] // Used in custom mode when choosing notes from main voice
}

export interface IChordPost {
    position: number
    length: number
    notes: string[] | null
    chordName: string | null
}

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

export interface IBarPost {
    position: number
    length: number
    notes: string[]
    chordName: string | null
}
