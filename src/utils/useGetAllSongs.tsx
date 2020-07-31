import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

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
    const getSongs = useApiService<ISong[]>(url, { params, initialData, headers }).fetchData;
    return getSongs;
}