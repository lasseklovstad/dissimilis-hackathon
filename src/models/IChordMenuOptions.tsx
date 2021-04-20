export enum ChordType {
    CHORD = "CHORD",
    NOTE = "NOTE",
}

export interface IChordMenuOptions {
    chordLength: number
    chord: string
    chordType: ChordType.CHORD | ChordType.NOTE
    chordNotes: string[]
}
