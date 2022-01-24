import { useEffect } from "react"
import { IGroup, IGroupIndex } from "../models/IGroup"
import { IOrganisation, IOrganisationIndex } from "../models/IOrganisation"
import { IUser } from "../models/IUser"
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

export enum UserRole {
    Admin = "Admin",
    Member = "Member",
}

/**
 * Get all groups based on different parameters
 * */
export const useGetGroups = (groupFilter?: GroupFilter) => {
    const url = groupFilter
        ? `organisations/groups?filterBy=${groupFilter}`
        : "organisations/groups"
    const initialData: IGroupIndex[] = []

    const { getData, state, data } = useApiService<IGroupIndex[]>(url, {
        initialData,
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
        ? `organisations/${organisationId}/groups?filterBy=${groupFilter}`
        : `organisations/${organisationId}/groups`

    const initialData: IGroupIndex[] = []

    const { getData, state, data } = useApiService<IGroupIndex[]>(url, {
        initialData,
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
        ? `organisations?filterByRole=${organisationFilter}`
        : "organisations"

    const initialData: IOrganisationIndex[] = []

    const { getData, state, data } = useApiService<IOrganisationIndex[]>(url, {
        initialData,
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

    const { getData, state, data } = useApiService<IGroup>(url, {})

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

    const body = {
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { postData, state } = useApiService<IGroup>(url, {
        body,
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

    const body = {
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { putData, state } = useApiService<IGroup>(url, { body })
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

    const { deleteData, state } = useApiService<IGroup>(url)

    return {
        deleteGroup: { run: deleteData, ...state },
    }
}

/**
 * Create one organisation
 */
export const usePostOrganisation = () => {
    const url = "organisations/"

    const body = {
        name: "",
        address: "",
        emailAddress: "",
        description: "",
        phoneNumber: "",
    }
    const { postData, state } = useApiService<IOrganisation>(url, {
        body,
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

    const { deleteData, state } = useApiService<IOrganisation>(url, {})

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

    const { getData, state, data } = useApiService<IOrganisation>(url, {})

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

    const body = {
        name: "",
        address: "",
        email: "",
        description: "",
        phoneNumber: "",
    }
    const { putData, state } = useApiService<IOrganisation>(url, {
        body,
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

    const body = {}
    const { postData, state } = useApiService<void>(url, {
        body,
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

    const body = {}
    const appendUrl = "/"
    const { deleteData, state } = useApiService<void>(url, {
        body,

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

    const body = {}
    const { postData, state } = useApiService<void>(url, {
        body,
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

    const body = {}
    const appendUrl = "/"
    const { deleteData, state } = useApiService<void>(url, {
        body,

        appendUrl,
    })

    return {
        removeOrganisationMember: { run: deleteData, ...state },
    }
}

/**
 *  Set a user's role in a group
 *  Role is set to either 'Member' or 'Admin'
 */
export const useSetUserRoleInGroup = (groupId: number) => {
    const url = `organisations/groups/${groupId}/users/`

    const body = {}
    const appendUrl = "/"
    const { putData, state } = useApiService<void>(url, {
        body,
        appendUrl,
    })

    return {
        setUserRoleInGroup: { run: putData, ...state },
    }
}

/**
 *  Set a user's role in an organisation
 *  Role is set to either 'Member' or 'Admin'
 */
export const useSetUserRoleInOrganisation = (organisationId: number) => {
    const url = `organisations/${organisationId}/users/`

    const body = {}
    const appendUrl = "/"
    const { putData, state } = useApiService<void>(url, {
        body,
        appendUrl,
    })

    return {
        setUserRoleInOrganisation: { run: putData, ...state },
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
    const urlStart = isGroup ? "organisations/groups" : "organisations"
    const url = `${urlStart}/${groupId}/users`

    const { getData, state, data } = useApiService<IUser[]>(url)

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getGroupMembers: { run: getData, ...state },
        groupMembers: data,
    }
}
