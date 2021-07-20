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
 * Get all groups based on different parameters
 * */
export const useGetGroups = (groupFilter: GroupFilter) => {
    const url = `organisations/groups?filter="${groupFilter}"`
    const initialData: IGroup[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IGroup[]>(url, {
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getAllSongs: { run: getData, ...state },
        allSongsFetched: data,
    }
}

/**
 * Get all groups in an organisation, based on different parameters
 * */
export const useGetGroupsInOrganisation = (
    groupFilter: GroupFilter,
    organisationId: number
) => {
    const url = `organisations/${organisationId}/groups?filter="${groupFilter}"`
    const initialData: IGroup[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IGroup[]>(url, {
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getAllSongs: { run: getData, ...state },
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
    const { getData, state, data } = useApiService<IOrganisation[]>(url, {
        body,
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getOrganisations: { run: getData, ...state },
        organisationsFetched: data,
    }
}
