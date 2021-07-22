import { IUser } from "./IUser"

export interface IOrganisation {
    organisationId: number
    organisationName: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
}
