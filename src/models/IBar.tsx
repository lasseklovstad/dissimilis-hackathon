export interface IChordAndNotes {
    noteNumber?: number
    notes: string[],
    length: number,
}

export interface IBar {
    barNumber?: number,
    house?: number | undefined,
    repBefore: boolean,
    repAfter: boolean,
    chordsAndNotes: Array<IChordAndNotes>,
};