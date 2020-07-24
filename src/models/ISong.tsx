import { IVoice } from "./IVoice";

export interface ISong {
    title: string;
    id?: number;
    //arranger: User;
    arrangerId?: number;
    composer?: string;
    timeSignature?: string;
    voices: IVoice[]
}



