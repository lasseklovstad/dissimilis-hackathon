import { useApiService } from "./useApiService";

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = () => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:5001" }
    const returnObject = useApiService<String>("post", url, { params });

    return returnObject;
}