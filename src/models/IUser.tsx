export interface IUser {
    userId: number
    name: string
    email: string
    isSystemAdmin: boolean
}

export interface IAdminStatuses {
    systemAdmin: boolean
    organisationAdmin: boolean
    groupAdmin: boolean
}
