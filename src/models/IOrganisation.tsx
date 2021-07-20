import { IUser } from "./IUser"

export interface IOrganisationIndex {
    organisationId: number
    name: string
}

export interface IOrganisation {
    organisationId: number
    name: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
}
