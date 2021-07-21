import { SongProtectionLevel } from "../utils/useApiServiceSongs"
import { IGroupIndex } from "./IGroup"
import { IOrganisationIndex } from "./IOrganisation"
import { IUser } from "./IUser"
import { IVoice } from "./IVoice"

export interface ISong {
    title: string
    songId: number
    voices: IVoice[]
    denominator: number
    numerator: number
    updatedOn: string
    arrangerName: string | null
}

export interface ISongIndex {
    songId: number
    title: string
    numerator: number
    denominator: number
    arrangerEmail: string
    updatedOn: string
}

export interface ISongPost {
    denominator: number
    numerator: number
    title: string
}

export interface ISongMetadata {
    songId: number
    title: string
    denominator: number
    numerator: number
    updatedOn: string
    arrangerName: string | null
    arrangerEmail: string | null
    creatorEmail: string | null
    composer: string | null
    songNotes: string | null
    speed: number
}

export interface ISongShareData {
    songId: number
    organisationTags: IOrganisationIndex[]
    groupTags: IGroupIndex[]
    sharedUsers: IUser[]
    protectionLevel: SongProtectionLevel
}
