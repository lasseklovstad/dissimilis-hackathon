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
    const getSongs = useApiService<ISong>(url, { headers }).fetchData
    return getSongs
}

/**
 * Get all songs
 * */
export const useGetAllSongs = () => {
    const url = "song/search"
    const params = { OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    const getSongs = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    }).fetchData
    return getSongs
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
    const getSongs = useApiService<ISong[]>(url, {
        initialData,
        headers,
        params,
    }).fetchData
    return getSongs
}

/**
 * Get songs based on recent songs
 * */
export const useGetRecentSongs = () => {
    const url = "song/search"
    const params = { Num: "5", OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    const getSongs = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    }).fetchData
    return getSongs
}

/**
 * Add a new song
 * @param Title and time signature of new song, id of new song is returned from backend
 */
export const usePostSong = (title: string, timeSignature: string) => {
    const url = "song"
    const headers = getHeaders()
    const body = { title, timeSignature }
    const postSong = useApiService<ISong>(url, { headers, body }).postData
    return postSong
}

/**
 * Post exisitng song
 */
export const usePutSong = (song: ISong) => {
    const url = `song/${song.id}`
    const body = song
    const headers = getHeaders()
    const putSong = useApiService<number>(url, { body, headers }).putData
    return putSong
}

/**
 * Delete one song
 * @param id songs id
 */
export const useDeleteSong = (id: number) => {
    const url = `song/${id}`
    const headers = getHeaders()
    const getSongs = useApiService<ISong>(url, { headers }).deleteData
    return getSongs
}
