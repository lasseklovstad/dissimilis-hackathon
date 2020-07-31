import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

export const usePostSong = (title: string, timeSignature: string) => {
    const url = 'song';
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, }; const body = { "title": title, "timeSignature": timeSignature };
    const postSong = useApiService<ISong>(url, { headers, body }).postData;
    return postSong;
}