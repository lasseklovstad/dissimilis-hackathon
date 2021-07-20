import { useEffect } from "react"
import { IGroup } from "../models/IGroup"
import { IOrganisation } from "../models/IOrganisation"
import { useApiService } from "./useApiService"

enum GroupFilter {
    Admin = "ADMIN",
    User = "USER",
    All = "ALL",
}

enum OrganisationFilter {
    Admin = "ADMIN",
    GroupAdmin = "GROUPADMIN",
    User = "USER",
    All = "ALL",
}

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    return { "X-API-Key": apiKey, "X-User-ID": userId }
}

/**
 * Get groups based on different parameters
 * */
export const useGetGroups = (
    groupFilter: GroupFilter,
    organisationId: number
) => {
    const url = "group/search"
    const body = {
        filter: groupFilter,
        organisationId: organisationId,
    }
    const initialData: IGroup[] = []
    const headers = getHeaders()
    const { postData, state, data } = useApiService<IGroup[]>(url, {
        body,
        initialData,
        headers,
    })

    useEffect(() => {
        postData()
    }, [postData])

    return {
        getAllSongs: { run: postData, ...state },
        allSongsFetched: data,
    }
}

/**
 * Get organisations based on different parameters
 * */
export const useGetOrganisations = (organisationFilter: OrganisationFilter) => {
    const url = "organization/search"
    const body = {
        filter: organisationFilter,
    }
    const initialData: IOrganisation[] = []
    const headers = getHeaders()
    const { postData, state, data } = useApiService<IOrganisation[]>(url, {
        body,
        initialData,
        headers,
    })

    useEffect(() => {
        postData()
    }, [postData])

    return {
        getOrganisations: { run: postData, ...state },
        organisationsFetched: data,
    }
}
