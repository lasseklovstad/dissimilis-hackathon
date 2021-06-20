export enum ChordType {
    CHORD = "CHORD",
    NOTE = "NOTE",
}

export interface IChordMenuOptions {
    chordLength: number
    chord: string | null
    chordType: ChordType.CHORD | ChordType.NOTE
    chordNotes: string[]
}
