export interface IUser {
    userId: number
    name: string
    email: string
}

export interface IAdminStatuses {
    systemAdmin: boolean
    organisationAdmin: boolean
    groupAdmin: boolean
}
