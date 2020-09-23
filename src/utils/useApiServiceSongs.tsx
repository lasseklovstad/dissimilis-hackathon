import { useEffect } from "react"
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
    const api = useApiService<ISong>(url, { headers })
    return {
        getSong: { run: api.getData, ...api.state },
    }
}

/**
 * Get all songs
 * */
export const useGetAllSongs = () => {
    const url = "song/search"
    const params = { OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getAllSongs: { run: getData, ...state },
        allSongs: data,
    }
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
    const { getData, state, data } = useApiService<ISong[]>(url, {
        initialData,
        headers,
        params,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getFilteredSongs: { run: getData, ...state },
        filteredSongs: data,
    }
}

/**
 * Get songs based on recent songs
 * */
export const useGetRecentSongs = () => {
    const url = "song/search"
    const params = { Num: "5", OrderByDateTime: "true" }
    const initialData: ISong[] = []
    const headers = getHeaders()
    const { getData, state, data } = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getRecentSongs: { run: getData, ...state },
        recentSongs: data,
    }
}

/**
 * Add a new song
 * @param Title and time signature of new song, id of new song is returned from backend
 */
export const usePostSong = (title: string, timeSignature: string) => {
    const url = "song"
    const headers = getHeaders()
    const body = { title, timeSignature }
    const api = useApiService<ISong>(url, { headers, body })
    return {
        postSong: { run: api.postData, ...api.state },
    }
}

/**
 * Post exisitng song
 */
export const usePutSong = (song: ISong) => {
    const url = `song/${song.id}`
    const body = song
    const headers = getHeaders()
    const api = useApiService<number>(url, { body, headers })
    return {
        putSong: { run: api.putData, ...api.state },
    }
}

/**
 * Delete one song
 * @param id songs id
 */
export const useDeleteSong = (id: number) => {
    const url = `song/${id}`
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        deleteSong: { run: api.deleteData, ...api.state },
    }
}
