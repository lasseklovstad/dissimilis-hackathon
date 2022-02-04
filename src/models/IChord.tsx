export type NoteTypes =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "H"
    | "X" // Note to indicate that it is removed from the original chord
    | "Z" // Empty note

export interface IChord {
    position: number
    notes: NoteTypes[]
    length: number
    chordId: number | null
    chordName: string | null
    selectedNotes?: string[] // Used in custom mode when choosing notes from main voice
}

export interface IChordPost {
    position: number
    length: number
    notes: NoteTypes[] | null
    chordName: string | null
}
