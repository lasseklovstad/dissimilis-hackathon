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
 *  Add user to group
 *  memeber: 10, admin: 20
 */
export const useAddGroupMember = (groupId: number) => {
    const url = `groups/${groupId}/addMember`
    const headers = getHeaders()
    const body = {}
    const { postData, state, data } = useApiService<void>(url, {
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
    const url = `groups/${groupId}/removeMember/${userId}`
    const headers = getHeaders()
    const body = {}
    const { deleteData, state, data } = useApiService<void>(url, {
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
    const url = `organisations/${organisationId}/addMember`
    const headers = getHeaders()
    const body = {}
    const { postData, state, data } = useApiService<void>(url, {
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
    const url = `groups/${organisationId}/removeMember/${userId}`
    const headers = getHeaders()
    const body = {}
    const { deleteData, state, data } = useApiService<void>(url, {
        body,
        headers,
    })

    return {
        removeOrganisationMember: { run: deleteData, ...state },
    }
}
