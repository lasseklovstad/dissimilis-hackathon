import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get songs based on recent songs 
 * Should the constant Num 5 be stored somewhere else?
 **/
export const useGetRecentSongs = () => {
    let url = "Song/songs";
    let params = {"Num": "5", "ArrangerId": "1", "OrderByDateTime": "true"}
    const [dataFromApi, isLoading, isError] = useApiService<ISong[]>("get", url, {params : params});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}