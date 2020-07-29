import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get one song
 * @param id songs id
 */
export const useDeleteSong = (id: number) => {
    const url = 'song/' + id;
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const getSongs = useApiService<ISong>(url, { headers }).deleteData;
    return getSongs;
}