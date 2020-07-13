import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

export const useGetFilteredSongs = (query: string) => {
    let url = "Song/songs";
    let params = {"Query": query.toString()}
    const [dataFromApi, isLoading, isError] = useApiService<ISong[]>("get", url, {params : params});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}