import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";
 
export const useGetSong = (id: number) => {
    let url = 'Song/songs';
    let params = {'Id': id.toString()}
    const [dataFromApi, isLoading, isError] = useApiService<ISong[]>("get", url, {params : params});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}