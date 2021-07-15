import { ISongIndex } from "../models/ISong"

export const updateSongTitleInListOfSongs = (
    songs: ISongIndex[] | undefined,
    songId: number,
    title: string
) => {
    return songs?.map((song: ISongIndex) => {
        if (song.songId === songId) {
            song.title = title
        }
        return song
    })
}
