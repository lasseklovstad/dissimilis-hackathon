import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

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