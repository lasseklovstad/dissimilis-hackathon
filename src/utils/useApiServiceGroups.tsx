import { useEffect } from "react"
import { IGroupIndex } from "../models/IGroup"
import { IOrganisationIndex } from "../models/IOrganisation"
import { useApiService } from "./useApiService"

export enum GroupFilter {
    Admin = "ADMIN",
    Member = "MEMBER",
}

export enum OrganisationFilter {
    Admin = "ADMIN",
    GroupAdmin = "GROUPADMIN",
    Member = "MEMBER",
}

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    return { "X-API-Key": apiKey, "X-User-ID": userId }
}

/**
 * Get all groups based on different parameters
 * */
export const useGetGroups = (groupFilter?: GroupFilter) => {
    const url = groupFilter
        ? `organisations/groups?filterBy=${groupFilter}}"`
        : "organisations/groups"
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
    organisationId: number,
    groupFilter?: GroupFilter
) => {
    const url = groupFilter
        ? `organisations/groups?filterBy=${groupFilter}}"`
        : "organisations/groups"

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
 * Get organisations based on different parameters
 * */
export const useGetOrganisations = (
    organisationFilter?: OrganisationFilter
) => {
    const url = organisationFilter
        ? `organisations?filterBy=${organisationFilter}}"`
        : "organisations"

    const initialData: IOrganisationIndex[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IOrganisationIndex[]>(url, {
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
