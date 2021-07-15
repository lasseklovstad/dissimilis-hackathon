import { IUser } from "./IUser"

export interface ICountry {
    countryId: number
    name: string
    address: string
    phoneNumber: string
    email: string
    notes: string
    admins: IUser[]
    members: IUser[]
}
