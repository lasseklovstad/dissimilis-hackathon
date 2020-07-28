export interface IChordAndNotes {
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