import { IVoice } from "./IVoice";

export interface ISong {
    title: string;
    id?: number;
    //arranger: User;
    voices: IVoice[]
    arrangerId?: number;
    composer?: string;
    timeSignature: string;
}



