import { useEffect } from "react"
import { IGroup, IGroupIndex } from "../models/IGroup"
import { IOrganisation, IOrganisationIndex } from "../models/IOrganisation"
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
    const url = `organisations/groups?filterBy="${groupFilter}"`
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
        getGroups: { run: getData, ...state },
        groupsFetched: data,
    }
}

/**
 * Get all groups in an organisation, based on different parameters
 * */
export const useGetGroupsInOrganisation = (
    groupFilter: GroupFilter,
    organisationId: number
) => {
    const url = `organisations/${organisationId}/groups?filterBy="${groupFilter}"`
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
        getGroups: { run: getData, ...state },
        groupsFetched: data,
    }
}

/**
 * Get organisations based on different parameters
 * */
export const useGetOrganisations = (organisationFilter: OrganisationFilter) => {
    const url = `organisation?filterBy="${organisationFilter}"`
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

/**
 * Get one group and its metadata
 * @param groupId group's id
 */
export const useGetGroup = (groupId: number) => {
    const url = `groups/${groupId}`
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IGroup>(url, {
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getGroup: { run: getData, ...state },
        groupFetched: data,
    }
}

/**
 * Create a new group
 */
export const usePostGroup = () => {
    const url = `group/`
    const headers = getHeaders()
    const body = {
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { postData, state, data } = useApiService<IGroup>(url, {
        body,
        headers,
    })

    return {
        postGroup: { run: postData, ...state },
    }
}

/**
 * Delete one group
 * @param groupId id of the group to delete
 */
export const useDeleteGroup = (groupId: number) => {
    const url = `group/${groupId}`
    const headers = getHeaders()

    const { deleteData, state, data } = useApiService<IGroup>(url, { headers })

    return {
        deleteGroup: { run: deleteData, ...state },
    }
}

/**
 * Create one organisation
 */
export const usePostOrganisation = () => {
    const url = `organisation/`
    const headers = getHeaders()
    const body = {
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { postData, state, data } = useApiService<IOrganisation>(url, {
        body,
        headers,
    })

    return {
        postOrganisation: { run: postData, ...state },
    }
}

/**
 * Delete one organisation
 * @param organisationId id of the organisation to delete
 */
export const useDeleteOrganisation = (organisationId: number) => {
    const url = `organisation/${organisationId}`
    const headers = getHeaders()

    const { deleteData, state, data } = useApiService<IOrganisation>(url, {
        headers,
    })

    return {
        deleteOrganisation: { run: deleteData, ...state },
    }
}

/**
 * Get one organisation and its metadata
 * @param organisationId organisation's id
 */
export const useGetOrganisation = (organisationId: number) => {
    const url = `organisations/${organisationId}`
    const headers = getHeaders()
    const { getData, state, data } = useApiService<IOrganisation>(url, {
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getOrganisation: { run: getData, ...state },
        organisationFetched: data,
    }
}
