import { IUser } from "./IUser"

export interface IOrganisationIndex {
    organisationId: number
    organisationName: string
}

export interface IOrganisation {
    organisationId: number
    organisationName: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
}
