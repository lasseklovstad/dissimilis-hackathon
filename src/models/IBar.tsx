export interface IChordAndNotes {
    notes: string[],
    length: number,
}

export interface IBar {
    id: string,
    barNumber: number | undefined,
    house?: number | undefined,
    repBefore: boolean,
    repAfter: boolean,
    chordsAndNotes: Array<IChordAndNotes>,

};