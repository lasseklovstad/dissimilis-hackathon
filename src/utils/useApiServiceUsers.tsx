import { useEffect } from "react"
import { useApiService } from "./useApiService"
import { IUser } from "../models/IUser"
import { useHistory } from "react-router"

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

export const useLogout = () => {
    const url = "user/logout"
    const headers = getHeaders()
    const history = useHistory()
    const { postData, state } = useApiService(url, { headers })

    const logout = async () => {
        const { error, result } = await postData()
        if (!error && result) {
            sessionStorage.clear()
            history.replace("/login")
        }
        return { error, result }
    }

    return {
        logout: { run: logout, ...state },
    }
}
