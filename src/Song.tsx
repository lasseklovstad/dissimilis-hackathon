import { IncomingHttpHeaders } from "http2";

export interface Song {
    title: string;
    id?: number;
    //arranger: User;
    arrangerId: number;
    composer: string;
    time_signature: string;
}



