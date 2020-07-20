import { apiService } from "./apiService";

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = () => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:3000/" }
    const getLoginUrl = apiService<string>("get", url, { params }).fetchData;
    return getLoginUrl;
}

export const useLoginPost = (code: string | null) => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:3000", "X-API-Key": sessionStorage.getItem("apiKey") || "", "X-User-ID": sessionStorage.getItem("userId") || "" }
    const body = { "code": code };
    const postLogin = apiService<Token>("post", url, { params, body }).postData;
    return postLogin;
}

export type Token = {
    apiKey: string,
    userID: number
}