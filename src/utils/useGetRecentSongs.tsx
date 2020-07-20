import { apiService } from "./apiService";
import { ISong } from "../models/ISong";

/**
 * Get songs based on recent songs 
 **/
export const useGetRecentSongs = () => {
    const url = "songs/search";
    const params = { "Num": "5", "ArrangerId": "2", "OrderByDateTime": "true" };
    const initialData: ISong[] = [];
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    console.log("apiKey: " + apiKey + " userId: " + userId)
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, }
    console.log(headers);
    const getSongs = apiService<ISong[]>("get", url, { params, initialData, headers }).fetchData;
    return getSongs;
}