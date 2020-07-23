import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get songs from database based on title or part of tilte
 * @param query title or part of title
 */
export const useGetFilteredSongs = () => {
    const url = "song/search";
    const initialData: ISong[] = [];
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, };
    const getSongs = useApiService<ISong[]>("get", url, { initialData, headers }).fetchData;
    return getSongs;
}