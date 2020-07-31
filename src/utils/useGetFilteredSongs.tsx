import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

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
    const getSongs = useApiService<ISong[]>(url, { initialData, headers, params }).fetchData;
    return getSongs;
}