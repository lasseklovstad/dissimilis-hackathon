import { useApiService } from "./useApiService"
import { ISong } from "../models/ISong"

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    const headers = { "X-API-Key": apiKey, "X-User-ID": userId }
    return headers
}

/**
 * Get one song
 * @param id songs id
 */
export const useGetSong = (id: number) => {
    const url = `song/${id}`
    const headers = getHeaders()
    return useApiService<ISong>(url, { headers })
}

/**
 * Get all songs
 * */
export const useGetAllSongs = () => {
    const url = "song/search"
    const params = { OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    return useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })
}

/**
 * Get songs from database based on title or part of title
 * @param query title or part of title
 */
export const useGetFilteredSongs = (title: string) => {
    const url = "song/search"
    const initialData: ISong[] = []
    const headers = getHeaders()
    const params = { title }
    return useApiService<ISong[]>(url, {
        initialData,
        headers,
        params,
    })
}

/**
 * Get songs based on recent songs
 * */
export const useGetRecentSongs = () => {
    const url = "song/search"
    const params = { Num: "5", OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    return useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })
}

/**
 * Add a new song
 * @param Title and time signature of new song, id of new song is returned from backend
 */
export const usePostSong = (title: string, timeSignature: string) => {
    const url = "song"
    const headers = getHeaders()
    const body = { title, timeSignature }
    return useApiService<ISong>(url, { headers, body })
}

/**
 * Post exisitng song
 */
export const usePutSong = (song: ISong) => {
    const url = `song/${song.id}`
    const body = song
    const headers = getHeaders()
    return useApiService<number>(url, { body, headers })
}

/**
 * Delete one song
 * @param id songs id
 */
export const useDeleteSong = (id: number) => {
    const url = `song/${id}`
    const headers = getHeaders()
    return useApiService<ISong>(url, { headers })
}
