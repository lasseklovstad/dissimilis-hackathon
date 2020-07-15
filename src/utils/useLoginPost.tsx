import { useApiService } from "./useApiService";

export const useLoginPost = (code: string | null) => {
    const url = 'login';
    const params = { "web_app_url": "https://localhost:3000" }
    const body = { "code": code };
    const dependencies = [code];
    const returnObject = useApiService<string>("post", url, { params, body, dependencies });

    return returnObject;
}