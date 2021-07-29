import { IUser } from "./IUser"

export interface IGroupIndex {
    groupId: number
    groupName: string
    organisationId?: number
    organisationName?: string
}

export interface IGroup {
    groupId: number
    groupName: string
    address: string
    phoneNumber: string
    email: string
    description: string
    admins: IUser[]
    organisationId?: string
    organisationName?: string
}
