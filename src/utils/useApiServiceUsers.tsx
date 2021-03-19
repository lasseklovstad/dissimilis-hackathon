import { useEffect } from "react"
import { useApiService } from "./useApiService"
import { IUser } from "../models/IUser"

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    const headers = { "X-API-Key": apiKey, "X-User-ID": userId }
    return headers
}

/**
 * Get current user
 */
 export const useGetUser = () => {
    const url = "user/currentUser"
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IUser>(url, { headers })
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getUser: { run: getData, ...state },
        userInit: data,
    }
}