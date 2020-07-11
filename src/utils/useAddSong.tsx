import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

export const useGetSong = (newSong: ISong) => {
    let url = 'Song/songs';
    let params = {}
    const [dataFromApi, isLoading, isError] = useApiService<ISong>("post", url, {params : params, body: newSong});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}