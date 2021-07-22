import { IUser } from "./IUser"

export interface IGroup {
    groupId: number
    groupName: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
    organisationId: string
    organisationName: string
}
