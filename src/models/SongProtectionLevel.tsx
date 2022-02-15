export enum SongProtectionLevel {
    Public = "Public",
    Private = "Private",
}

export interface ChangeSongProtectionLevelPayload {
    protectionLevel: SongProtectionLevel
}

export interface ChangeSongProtectionLevel {
    protectionLevel: SongProtectionLevel
    songId: number
}
