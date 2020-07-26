import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";


export const usePutSong = (song: ISong) => {

    const url = 'song/' + 7;
    const body = song
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };

    const putSong = useApiService<number>("post", url, { body, headers }).putData;


    return putSong;
}