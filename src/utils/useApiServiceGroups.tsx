import { useEffect } from "react"
import { IGroup, IGroupIndex } from "../models/IGroup"
import { IOrganisation, IOrganisationIndex } from "../models/IOrganisation"
import { IUser } from "../models/IUser"
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

export enum UserLevel {
    Admin = 20,
    Member = 10,
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
    const url = `group/groups?filterBy=${groupFilter}`
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
    const url = `group/${organisationId}/groups?filterBy=${groupFilter}`
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
    const url = `organisation?filterBy=${organisationFilter}`
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
    const url = `group/${groupId}`
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
    const { postData, state } = useApiService<IGroup>(url, {
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

    const { deleteData, state } = useApiService<IGroup>(url, { headers })

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
    const { postData, state } = useApiService<IOrganisation>(url, {
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

    const { deleteData, state } = useApiService<IOrganisation>(url, {
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
    const url = `organisation/${organisationId}`
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

/**
 *  Add user to group
 *  memeber: 10, admin: 20
 */
export const useAddGroupMember = (groupId: number) => {
    const url = `group/${groupId}/addMember`
    const headers = getHeaders()
    const body = {}
    const { postData, state } = useApiService<void>(url, {
        body,
        headers,
    })

    return {
        addGroupMember: { run: postData, ...state },
    }
}

/**
 *  Remove user from group
 */
export const useRemoveGroupMember = (groupId: number, userId: number) => {
    const url = `group/${groupId}/removeMember/${userId}`
    const headers = getHeaders()
    const body = {}
    const { deleteData, state } = useApiService<void>(url, {
        body,
        headers,
    })

    return {
        removeGroupMember: { run: deleteData, ...state },
    }
}

/**
 *  Add user to organisation
 *  memeber: 10, admin: 20
 */
export const useAddOrganisationMember = (organisationId: number) => {
    const url = `organisation/${organisationId}/addMember`
    const headers = getHeaders()
    const body = {}
    const { postData, state } = useApiService<void>(url, {
        body,
        headers,
    })

    return {
        addOrganisationMember: { run: postData, ...state },
    }
}

/**
 *  Remove user from group
 */
export const useRemoveOrganisationMember = (
    organisationId: number,
    userId: number
) => {
    const url = `group/${organisationId}/removeMember/${userId}`
    const headers = getHeaders()
    const body = {}
    const { deleteData, state } = useApiService<void>(url, {
        body,
        headers,
    })

    return {
        removeOrganisationMember: { run: deleteData, ...state },
    }
}

/**
 * Get members of a group or an organisation in the form of an array of IUsers
 * @param groupId id of the group or organisation containing the members
 */
export const useGetGroupOrOrganisationMembers = (
    isGroup: boolean,
    groupId: number
) => {
    const urlStart = isGroup ? `group` : `organisation`
    const url = `${urlStart}/${groupId}/users`
    const headers = getHeaders()

    const { getData, state, data } = useApiService<IUser[]>(url, { headers })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getGroupMembers: { run: getData, ...state },
        groupMembers: data,
    }
}
