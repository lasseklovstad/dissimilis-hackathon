import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";


/**
 * Get one song
 * @param id songs id
 */
export const useGetSong = (id: number) => {
    const url = 'song/' + id;
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const getSongs = useApiService<ISong>("get", url, { headers }).fetchData;
    return getSongs;
}

/**
 * Get songs based on recent songs 
 **/
export const useGetAllSongs = () => {
    const url = "song/search";
    const params = { "OrderByDateTime": "true" };
    const initialData: ISong[] = [];
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const getSongs = useApiService<ISong[]>("get", url, { params, initialData, headers }).fetchData;
    return getSongs;
}

/**
 * Get songs from database based on title or part of tilte
 * @param query title or part of title
 */
export const useGetFilteredSongs = (title: string) => {
    const url = "song/search";
    const initialData: ISong[] = [];
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const params = { "title": title };
    const getSongs = useApiService<ISong[]>("get", url, { initialData, headers, params }).fetchData;
    return getSongs;
}

/**
 * Get songs based on recent songs 
 **/
export const useGetRecentSongs = () => {
    const url = "song/search";
    const params = { "Num": "5", "OrderByDateTime": "true" };
    const initialData: ISong[] = [];
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const getSongs = useApiService<ISong[]>("get", url, { params, initialData, headers }).fetchData;
    return getSongs;
}

export const usePutSong = (song: ISong) => {

    const url = 'song/' + song.id;
    const body = song
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const putSong = useApiService<number>("post", url, { body, headers }).putData;
    return putSong;
}

export const usePostSong = (title: string, timeSignature: string) => {
    const url = 'song';
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, }; const body = { "title": title, "timeSignature": timeSignature };
    const postSong = useApiService<ISong>("post", url, { headers, body }).postData;
    return postSong;
}