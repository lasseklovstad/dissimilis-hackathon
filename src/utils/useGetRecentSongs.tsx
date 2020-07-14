import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get songs based on recent songs 
 **/
export const useGetRecentSongs = () => {
    const url = "Song/songs";
    const params = { "Num": "5", "ArrangerId": "1", "OrderByDateTime": "true" };
    const initialData: ISong[] = [];
    const dataFromApi = useApiService<ISong[]>("get", url, { params, initialData });
    return dataFromApi;
}