import { useEffect } from "react"
import { useApiService } from "./useApiService"
import { ISong, ISongIndex, ISongMetadata } from "../models/ISong"
import { IBar } from "../models/IBar"
import { IVoice, IVoiceDuplicatePost, IVoicePost } from "../models/IVoice"

const getArrangerId = () => {
    return sessionStorage.getItem("userId") || ""
}

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    return { "X-API-Key": apiKey, "X-User-ID": userId }
}

/**
 * Get one song
 * @param id songs id
 */
export const useGetSong = (id: string) => {
    const url = `song/${id}`
    const headers = getHeaders()
    const { getData, state, data } = useApiService<ISong>(url, { headers })
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getSong: { run: getData, ...state },
        songInit: data,
    }
}

/**
 * Get metadata for one song
 * @param id songs id
 */
export const useGetSongMetadata = (id: string) => {
    const url = `song/${id}/metadata`
    const headers = getHeaders()
    const { getData, state, data } = useApiService<ISongMetadata>(url, {
        headers,
    })
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getSongMetadata: { run: getData, ...state },
        songMetadataFetched: data,
    }
}

/**
 * Transpose song
 * @param id songs id
 * @param title new song title
 * @param transpose number of semi-tones to transpose
 */
export const useTransposeSong = (
    id: string,
    title: string,
    transpose: string
) => {
    const url = `song/${id}/transpose`
    const body = {
        title,
        transpose,
    }
    const headers = getHeaders()
    const { postData, state, data } = useApiService<ISong>(url, {
        body,
        headers,
    })

    return {
        transposeSong: { run: postData, ...state },
        songTransposedInit: data,
    }
}

/**
 * Get all songs
 * */
export const useGetAllSongs = (orderTerm: string, orderDescending: boolean) => {
    const url = "song/search"
    const body = {
        orderBy: orderTerm,
        orderDescending,
    }
    const initialData: ISongIndex[] = []
    const headers = getHeaders()
    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        body,
        initialData,
        headers,
    })

    useEffect(() => {
        postData()
    }, [postData])

    return {
        getAllSongs: { run: postData, ...state },
        allSongsFetched: data,
    }
}

/**
 * Get songs from database based on title or part of title
 * @param query title or part of title
 */
export const useGetFilteredSongs = (
    title: string,
    orderTerm: string,
    orderDescending: boolean
) => {
    const url = "song/search"
    const initialData: ISongIndex[] = []
    const headers = getHeaders()
    const body = {
        title,
        orderBy: orderTerm,
        orderDescending,
    }
    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        initialData,
        headers,
        body,
    })

    useEffect(() => {
        postData()
    }, [postData])

    return {
        getFilteredSongs: { run: postData, ...state },
        filteredSongsFetched: data,
    }
}

/**
 * Get songs based on recent songs
 * */
export const useGetRecentSongs = (
    orderTerm: string,
    orderDescending: boolean
) => {
    const url = "song/search"
    const body = {
        num: "5",
        orderBy: orderTerm,
        orderDescending,
        arrangerId: getArrangerId(),
    }
    const initialData: ISongIndex[] = []
    const headers = getHeaders()
    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        body,
        initialData,
        headers,
    })

    useEffect(() => {
        postData()
    }, [postData])

    return {
        getRecentSongs: { run: postData, ...state },
        recentSongsFetched: data,
    }
}

/**
 * Add a new song
 * @param Title and time signature of new song, id of new song is returned from backend
 */
export const usePostSong = () => {
    const url = "song"
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        postSong: { run: api.postData, ...api.state },
    }
}

/**
 * Post exisitng song
 */
export const useUpdateSong = (songId: string) => {
    const url = `song/${songId}`
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        putSong: { run: api.putData, ...api.state },
    }
}

/**
 * Delete one song
 * @param id songs id
 */
export const useDeleteSong = (id: string) => {
    const url = `song/${id}`
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        deleteSong: { run: api.deleteData, ...api.state },
    }
}

export const useCreateVoice = (songId: string) => {
    const url = `song/${songId}/voice`
    const headers = getHeaders()
    const api = useApiService<IVoice, IVoicePost>(url, { headers })
    return {
        postVoice: { run: api.postData, ...api.state },
    }
}

export const useDuplicateVoice = (
    songId: string,
    voiceId: number | undefined
) => {
    const url = `song/${songId}/voice/${voiceId}/duplicate`
    const headers = getHeaders()
    const api = useApiService<IVoice, IVoiceDuplicatePost>(url, { headers })
    return {
        duplicateVoice: { run: api.postData, ...api.state },
    }
}

export const useUpdateVoice = (songId: string, voiceId: number | undefined) => {
    const url = `song/${songId}/voice/${voiceId}`
    const headers = getHeaders()
    const api = useApiService<IVoice>(url, { headers })
    return {
        putVoice: { run: api.putData, ...api.state },
    }
}

export const useDeleteVoice = (songId: string, voiceId: number | undefined) => {
    const url = `song/${songId}/voice/${voiceId}`
    const headers = getHeaders()
    const api = useApiService<void>(url, { headers })
    return {
        deleteVoice: { run: api.deleteData, ...api.state },
    }
}

export const useCreateChord = (
    songId: number,
    voiceId: number,
    barId: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barId}/note`
    const headers = getHeaders()
    const api = useApiService<IBar>(url, { headers })

    return {
        postChord: { run: api.postData, ...api.state },
    }
}

export const useCopyBars = (songId: string) => {
    const url = `song/${songId}/copyBars`
    const headers = getHeaders()

    const api = useApiService<ISong>(url, {
        headers,
    })
    return {
        postCopyBars: {
            run: (body: {
                fromPosition: number
                copyLength: number
                toPosition: number
            }) => api.postData(body),
            ...api.state,
        },
    }
}

export const useDeleteBars = (songId: string) => {
    const url = `song/${songId}/deleteBars`
    const headers = getHeaders()

    const api = useApiService<ISong>(url, {
        headers,
    })
    return {
        postDeleteBars: {
            run: (body: { fromPosition: number; deleteLength: number }) =>
                api.postData(body),
            ...api.state,
        },
    }
}

export const useDeleteChord = (
    songId: number,
    voiceId: number,
    barId: number,
    chordId: number | null
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barId}/note/${chordId}`
    const headers = getHeaders()
    const api = useApiService<IBar>(url, { headers })

    return {
        deleteChord: { run: api.deleteData, ...api.state },
    }
}

export const useUpdateChord = (
    songId: string,
    voiceId: number | undefined,
    barId: number | undefined,
    noteId: number | undefined | null
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barId}/note/${noteId}`
    const headers = getHeaders()
    const api = useApiService<IBar>(url, { headers })

    return {
        updateChord: { run: api.putData, ...api.state },
    }
}

export const useAddBar = (songId: string, voiceId: number) => {
    const url = `song/${songId}/voice/${voiceId}/bar`
    const headers = getHeaders()
    const body = {
        repBefore: false,
        repAfter: false,
        house: 0,
    }
    const api = useApiService<ISong>(url, { headers, body })

    return {
        postBar: { run: api.postData, ...api.state },
    }
}

export const useDuplicateBar = (songId: number) => {
    const url = `song/${songId}/copyBars`
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        duplicateBar: { run: api.postData, ...api.state },
    }
}

export const useDeleteBar = (
    songId: number,
    voiceId: number,
    barId: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barId}`
    const headers = getHeaders()
    const api = useApiService<IVoice>(url, { headers })

    return {
        deleteBar: { run: api.deleteData, ...api.state },
    }
}

export const useUpdateBar = (
    songId: number,
    voiceId: number,
    barId: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barId}`
    const headers = getHeaders()
    const api = useApiService<IVoice>(url, { headers })

    return {
        putBar: { run: api.putData, ...api.state },
    }
}

/**
 * Duplicate song
 * @param songId songs id
 */
export const useDuplicateSong = (songId: number) => {
    const url = `song/${songId}/duplicateSong`
    const headers = getHeaders()

    const api = useApiService<ISong>(url, { headers })

    return {
        duplicateSong: { run: api.postData, ...api.state },
    }
}

export const useUndoSong = (songId: string) => {
    const url = `song/${songId}/undo`
    const headers = getHeaders()

    const api = useApiService<ISong>(url, { headers })

    return {
        undoSong: { run: api.putData, ...api.state },
    }
}
