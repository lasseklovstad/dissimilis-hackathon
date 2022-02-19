import { useEffect } from "react"
import { useApiService } from "./useApiService"
import { IAdminStatuses, IUser } from "../models/IUser"
import { useNavigate } from "react-router"
import { ISearchWithPagination } from "../models/ISearchWithPagination"
import { IMyGroupUsersPayload } from "../models/IMyGroupUsersPayload"

/**
 * Get current user
 */
export const useGetUser = () => {
    const url = "user/currentUser"

    const { getData, state, data } = useApiService<IUser>(url)
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getUser: { run: getData, ...state },
        user: data,
    }
}

export const useLogout = () => {
    const url = "user/logout"

    const navigate = useNavigate()
    const { postData, state } = useApiService(url)

    const logout = async () => {
        const { error, result } = await postData()
        if (!error && result) {
            sessionStorage.clear()
            navigate("/")
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

    const { getData, state, data } = useApiService<IAdminStatuses>(url)

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

    const initialData: IUser[] = []
    const { getData, state, data } = useApiService<IUser[]>(url, {
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

    const initialData: IUser[] = []
    const { getData, state, data } = useApiService<IUser[]>(url, {
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
    const url = "user/"

    const body = {}
    const appendUrl = "/"
    const { putData, state } = useApiService<void>(url, {
        body,
        appendUrl,
    })

    return {
        setSysAdminStatus: { run: putData, ...state },
    }
}

export const useGetMyGroupUsers = () => {
    const body: IMyGroupUsersPayload = {
        searchText: "",
        pageSize: 10,
        page: 1,
    }
    const { postData, state, data } = useApiService<
        ISearchWithPagination<IUser, IMyGroupUsersPayload>,
        IMyGroupUsersPayload
    >("user/myGroupUsers", { body })

    useEffect(() => {
        postData()
    }, [postData])

    const run = (searchText = "") => {
        return postData({ ...body, searchText })
    }

    return {
        getMyGroupUsers: { run, ...state },
        myGroupUsers: data,
    }
}
