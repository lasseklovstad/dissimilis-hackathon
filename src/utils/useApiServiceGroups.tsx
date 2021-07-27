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
    Admin = "Admin",
    Member = "Member",
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
    const url = `organisations/groups?filterBy=${groupFilter}`
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
    const url = `organisations/${organisationId}/groups?filterBy=${groupFilter}`
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
    const url = `organisations?filterBy=${organisationFilter}`
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
    const url = `organisations/groups/${groupId}`
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
    const url = "organisations/groups/"
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
 * Update group details
 */
export const useUpdateGroup = (groupId: number) => {
    const url = `organisations/groups/${groupId}`
    const headers = getHeaders()
    const body = {
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { putData, state } = useApiService<IGroup>(url, { body, headers })
    return {
        updateGroup: { run: putData, ...state },
    }
}

/**
 * Delete one group
 * @param groupId id of the group to delete
 */
export const useDeleteGroup = (groupId: number) => {
    const url = `organisations/groups/${groupId}`
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
    const url = "organisations/"
    const headers = getHeaders()
    const body = {
        name: "",
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
    const url = `organisations/${organisationId}`
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

/**
 * Update organisatoion details
 */
export const useUpdateOrganisation = (organisationId: number) => {
    const url = `organisations/${organisationId}`
    const headers = getHeaders()
    const body = {
        name: "",
        address: "",
        email: "",
        description: "",
        phoneNumber: "",
    }
    const { putData, state } = useApiService<IOrganisation>(url, {
        body,
        headers,
    })
    return {
        updateOrganisation: { run: putData, ...state },
    }
}

/**
 *  Add user to group
 *  memeber: 10, admin: 20
 */
export const useAddGroupMember = (groupId: number) => {
    const url = `organisations/groups/${groupId}/users`
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
export const useRemoveGroupMember = (groupId: number) => {
    const url = `organisations/groups/${groupId}/users`
    const headers = getHeaders()
    const body = {}
    const appendUrl = `/`
    const { deleteData, state } = useApiService<void>(url, {
        body,
        headers,
        appendUrl,
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
    const url = `organisations/${organisationId}/users`
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
export const useRemoveOrganisationMember = (organisationId: number) => {
    const url = `organisations/${organisationId}/users`
    const headers = getHeaders()
    const body = {}
    const appendUrl = `/`
    const { deleteData, state } = useApiService<void>(url, {
        body,
        headers,
        appendUrl,
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
    const urlStart = isGroup ? `organisations/groups` : `organisations`
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
