import { useApiService } from "./useApiService";

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = () => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:3000/" }
    const returnObject = useApiService<string>("get", url, { params });


    return returnObject;
}