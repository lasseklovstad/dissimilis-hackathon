
export interface IChordAndTones {
    tones: string[],
    size: number,
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