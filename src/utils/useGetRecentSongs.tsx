import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

export const useGetRecentSongs = () => {
    let url = "Song/songs";
    let params = {"Num": "5", "ArrangerId": "1", "OrderByDateTime": "true"}
    const [dataFromApi, isLoading, isError] = useApiService<ISong[]>("get", url, {params : params});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}