import { useEffect } from "react"
import { useApiService } from "./useApiService"
import { IAdminStatuses, IUser } from "../models/IUser"
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
    }

    return {
        logout: { run: logout, ...state },
    }
}

/**
 * Get admin statuses of current user
 */
export const useGetAdminStatuses = () => {
    const url = "user/currentUser/adminStatuses"
    const headers = getHeaders()

    const { getData, state, data } = useApiService<IAdminStatuses>(url, {
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getAdminStatuses: { run: getData, ...state },
        adminStatuses: data,
    }
}

/**
 * Get all users in the system
 */
export const useGetUsers = () => {
    const url = "user"
    const headers = getHeaders()
    const initialData: IUser[] = []
    const { getData, state, data } = useApiService<IUser[]>(url, {
        headers,
        initialData,
    })
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getUsers: { run: getData, ...state },
        users: data,
    }
}

/*
 * Get all system administrators in the system
 */
export const useGetSysAdmins = () => {
    const url = "user/sysAdmins"
    const headers = getHeaders()
    const initialData: IUser[] = []
    const { getData, state, data } = useApiService<IUser[]>(url, {
        headers,
        initialData,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getSysAdmins: { run: getData, ...state },
        sysAdmins: data,
    }
}

/**
 *  Set whether a user is a system administrator or not
 *  sysAdmin status on user is set to either true or false
 */
export const useSetSysAdminStatus = () => {
    const url = `user/`
    const headers = getHeaders()
    const body = {}
    const appendUrl = `/`
    const { putData, state } = useApiService<void>(url, {
        headers,
        body,
        appendUrl,
    })

    return {
        setSysAdminStatus: { run: putData, ...state },
    }
}
