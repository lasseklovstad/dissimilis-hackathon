import { useApiService } from "./useApiService";

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = (id: number) => {
    let url = 'login';
    let params = {login: "login"}
    const [dataFromApi, isLoading, isError] = useApiService<String>("get", url, {params : params});

    if(!isLoading && !isError){
        return dataFromApi
    } 
    return []
}