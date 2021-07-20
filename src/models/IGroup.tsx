import { IUser } from "./IUser"

export interface IGroupIndex {
    groupId: number
    name: string
    organisationId?: number
    organisationName?: string
}

export interface IGroup {
    groupId: number
    name: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
    organisationId?: string
    organisationName?: string
}
