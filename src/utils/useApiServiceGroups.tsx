import { useEffect } from "react"
import { IGroup, IGroupIndex } from "../models/IGroup"
import { IOrganisationIndex } from "../models/IOrganisation"
import { useApiService } from "./useApiService"

export enum GroupFilter {
    Admin = "ADMIN",
    User = "USER",
    All = "ALL",
}

export enum OrganisationFilter {
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
    const url = `organisations/groups?filter=${groupFilter}`
    const initialData: IGroupIndex[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IGroupIndex[]>(url, {
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getAllGroups: { run: getData, ...state },
        allGroupsFetched: data,
    }
}

/**
 * Get all groups in an organisation, based on different parameters
 * */
export const useGetGroupsInOrganisation = (
    groupFilter: GroupFilter,
    organisationId: number
) => {
    const url = `organisations/${organisationId}/groups?filter=${groupFilter}`
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
        getAllGroups: { run: getData, ...state },
        allGroupsFetched: data,
    }
}

/**
 * Get organisations based on different parameters
 * */
export const useGetOrganisations = (organisationFilter: OrganisationFilter) => {
    const url = `organisations?filter=${organisationFilter}`
    const body = {
        filter: organisationFilter,
    }
    const initialData: IOrganisationIndex[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IOrganisationIndex[]>(url, {
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
