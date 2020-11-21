import { useApiService } from "./useApiService"

/**
 * Get one song
 * @param id songs id
 */

export const useLoginRedirect = () => {
    const url = "login"
    const params = { web_app_url: process.env.REACT_APP_PUBLIC_URL as string }
    const getLoginUrl = useApiService<string>(url, { params }).getData
    return getLoginUrl
}

export const useLoginPost = (code: string | null) => {
    const url = "login"
    const params = {
        web_app_url: process.env.REACT_APP_PUBLIC_URL as string,
        "X-API-Key": sessionStorage.getItem("apiKey") || "",
        "X-User-ID": sessionStorage.getItem("userId") || "",
    }
    const body = { code }
    const postLogin = useApiService<Token>(url, { params, body }).postData
    return postLogin
}

export type Token = {
    apiKey: string
    userID: number
}
