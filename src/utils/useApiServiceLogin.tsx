import { useApiService } from "./useApiService"

/**
 * Get one song
 */
export const useLoginRedirect = () => {
    const url = "login"
    const params = { web_app_url: process.env.REACT_APP_PUBLIC_URL as string }
    return useApiService<string>(url, { params }).getData
}

export const useLoginPost = (code: string | null) => {
    const url = "login"
    const params = {
        web_app_url: process.env.REACT_APP_PUBLIC_URL as string,
        "X-API-Key": sessionStorage.getItem("apiKey") || "",
        "X-User-ID": sessionStorage.getItem("userId") || "",
    }
    const body = { code }
    return useApiService<Token>(url, { params, body }).postData
}

export type Token = {
    apiKey: string
    userID: number
}
