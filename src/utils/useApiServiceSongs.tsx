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
        getSong: api.getData,
        songError: { error: api.state.error, isError: api.state.isError },
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
    const api = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })

    return {
        getAllSongs: api.getData,
        allSongs: api.data,
        allSongsError: {
            isError: api.state.isError,
            error: api.state.error,
        },
        isAllSongsLoading: api.state.loading,
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
    const api = useApiService<ISong[]>(url, {
        initialData,
        headers,
        params,
    })
    return {
        getFilteredSongs: api.getData,
        filteredSongs: api.data,
        isFilteredSongsLoading: api.state.loading,
        filteredSongsError: {
            isError: api.state.isError,
            error: api.state.error,
        },
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
    const api = useApiService<ISong[]>(url, {
        params,
        initialData,
        headers,
    })
    return {
        getRecentSongs: api.getData,
        recentSongs: api.data,
        isRecentSongsLoading: api.state.loading,
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
        postSong: api.postData,
        postSongError: { error: api.state.error, isError: api.state.isError },
        isPostSongLoading: api.state.loading,
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
        putSong: api.putData,
        putSongError: { error: api.state.error, isError: api.state.isError },
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
        deleteSong: api.deleteData,
        deleteSongError: { error: api.state.error, isError: api.state.isError },
        deleteSongLoading: api.state.loading,
    }
}
