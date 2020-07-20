import { useApiService } from "./useApiService";

export const useLoginPost = (code: string | null) => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:3000" }
    const body = { "code": code };
    const dependencies = [code];
    const postLogin = useApiService<Token>("post", url, { params, body }).postData;
    return postLogin;
}

export type Token = {
    apiKey: string,
    userID: number
}
