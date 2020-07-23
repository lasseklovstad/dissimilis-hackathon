import { useApiService } from "./useApiService";

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = () => {
    const url = 'login';
    const params = { "web_app_url": "https://dissimilisfargenotasjon.azurewebsites.net/" };
    const getLoginUrl = useApiService<string>("get", url, { params }).fetchData;
    return getLoginUrl;
}

export const useLoginPost = (code: string | null) => {
    const url = 'login';
    const params = { "web_app_url": "https://dissimilisfargenotasjon.azurewebsites.net/", "X-API-Key": sessionStorage.getItem("apiKey") || "", "X-User-ID": sessionStorage.getItem("userId") || "" };
    const body = { "code": code };
    const postLogin = useApiService<Token>("post", url, { params, body }).postData;
    return postLogin;
}

export type Token = {
    apiKey: string,
    userID: number
}