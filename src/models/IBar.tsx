
export interface IChordAndTones {
    notes: string[],
    length: number,
}

export interface IBar {
    barNumber: number | undefined,
    barLineBefore: boolean,
    barLineAfter: boolean,
    house?: number | undefined,
    repBefore: boolean,
    repAfter: boolean,
    chordsAndTones: Array<IChordAndTones>,

};