import { IBar } from "./IBar";

export interface IVoice {
    title: string,
    priority: number,
    bars: Array<IBar>
}