import { useEffect } from "react"
import { useApiService } from "./useApiService"
import {
    ISong,
    ISongIndex,
    ISongMetadata,
    ISongShareData,
} from "../models/ISong"
import { IBar } from "../models/IBar"
import { IVoice, IVoiceDuplicatePost, IVoicePost } from "../models/IVoice"
import { IGroupIndex } from "../models/IGroup"
import { IOrganisationIndex } from "../models/IOrganisation"
import { IUser } from "../models/IUser"

export enum SongProtectionLevel {
    Public = "Public",
    Private = "Private",
}

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
 * @param songId songs id
 */
export const useGetSong = (songId: number) => {
    const url = `song/${songId}`
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
 * @param songId songs id
 */
export const useGetSongMetadata = (songId: number) => {
    const url = `song/${songId}/metadata`
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
    songId: number,
    title: string,
    transpose: string
) => {
    const url = `song/${songId}/transpose`
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
    orderDescending: boolean,
    numberOfResults?: string
) => {
    const url = "song/search"
    const initialData: ISongIndex[] = []
    const headers = getHeaders()
    const body = {
        maxNumberOfSongs: numberOfResults,
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
        maxNumberOfSongs: "5",
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
export const useUpdateSong = (songId: number) => {
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
export const useDeleteSong = (songId: number) => {
    const url = `song/${songId}`
    const headers = getHeaders()
    const api = useApiService<ISong>(url, { headers })
    return {
        deleteSong: { run: api.deleteData, ...api.state },
    }
}

export const useCreateVoice = (songId: number) => {
    const url = `song/${songId}/voice`
    const headers = getHeaders()
    const api = useApiService<IVoice, IVoicePost>(url, { headers })
    return {
        postVoice: { run: api.postData, ...api.state },
    }
}

export const useDuplicateVoice = (
    songId: number,
    voiceId: number | undefined
) => {
    const url = `song/${songId}/voice/${voiceId}/duplicate`
    const headers = getHeaders()
    const api = useApiService<IVoice, IVoiceDuplicatePost>(url, { headers })
    return {
        duplicateVoice: { run: api.postData, ...api.state },
    }
}

export const useUpdateVoice = (songId: number, voiceId: number | undefined) => {
    const url = `song/${songId}/voice/${voiceId}`
    const headers = getHeaders()
    const api = useApiService<IVoice>(url, { headers })
    return {
        putVoice: { run: api.putData, ...api.state },
    } 
}

export const useDeleteVoice = (songId: number, voiceId: number | undefined) => {
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

export const useCopyBars = (songId: number | undefined) => {
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

export const useDeleteBars = (songId: number) => {
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
    songId: number,
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

export const useAddNote = (
    songId: number,
    voiceId: number | undefined,
    barPosition: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barPosition}/note/addComponentInterval`
    const headers = getHeaders()
    const api = useApiService<IBar>(url, { headers })

    return {
        addNote: { run: api.postData, ...api.state },
    }
}

export const useRemoveNote = (
    songId: number,
    voiceId: number | undefined,
    barPosition: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barPosition}/note/removeComponentInterval`
    const headers = getHeaders()
    const api = useApiService<IBar>(url, { headers })

    return {
        removeNote: { run: api.postData, ...api.state },
    }
}

export const useAddBar = (songId: number, voiceId: number) => {
    const url = `song/${songId}/voice/${voiceId}/bar`
    const headers = getHeaders()
    const body = {
        repBefore: false,
        repAfter: false,
        voltaBracket: 0,
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
 * @param songId song's id
 */
export const useDuplicateSong = (songId: number) => {
    const url = `song/${songId}/duplicateSong`
    const headers = getHeaders()

    const api = useApiService<ISong>(url, { headers })

    return {
        duplicateSong: { run: api.postData, ...api.state },
    }
}

/**
 * Set group tags for song
 * @param songId song's id
 */
export const useSetGroupTags = (songId: number) => {
    const url = `song/${songId}/Tag/Group`
    const headers = getHeaders()

    const emptyGroupTags: number[] = []
    const body = {
        tagIds: emptyGroupTags,
    }

    const api = useApiService<IGroupIndex>(url, { headers, body })

    return {
        setGroupTags: { run: api.putData, ...api.state },
    }
}

/**
 * Set organisation tags for song
 * @param songId song's id
 */
export const useSetOrganisationTags = (songId: number) => {
    const url = `song/${songId}/Tag/Organisation`
    const headers = getHeaders()

    const emptyOrganisationTags: number[] = []
    const body = {
        tagIds: emptyOrganisationTags,
    }

    const api = useApiService<IOrganisationIndex>(url, { headers, body })

    return {
        setOrganisationTags: { run: api.putData, ...api.state },
    }
}

/**
 * Share song with user
 * @param songId song's id
 * @param userId userId of user recieving write permission
 */
export const useShareSong = (songId: number) => {
    const url = `song/${songId}/shareSong/User`
    const headers = getHeaders()

    const appendUrl = `/`
    const api = useApiService<IUser[]>(url, { headers, appendUrl })

    return {
        shareSong: { run: api.postData, ...api.state },
    }
}

/**
 * add component interval voice
 * @param songId
 * @param voiceId
 */
export const useAddComponentInterval = (songId: number, voiceId: number) => {
{
        const url = `song/${songId}/voice/${voiceId}/addComponentInterval`
        const headers = getHeaders()
        const body = {
            intervalPosition: 0,
            sourceVoiceId: 0
        }

        const api = useApiService<IVoice>(url, {
            headers, body
        })
    
        return {
            addInterval: { run: api.postData, ...api.state, ...api.data
            },
        }
    }
}
/**
 * remove component interval voice
 * @param songId
 * @param voiceId
 */
 export const useRemoveComponentInterval = (songId: number, voiceId: number) => {
    {
        const url = `song/${songId}/voice/${voiceId}/RemoveComponentInterval`
        const headers = getHeaders()
        const body = {
            intervalPosition: 0,
            sourceVoiceId: 0
        }

        const api = useApiService<IVoice>(url, {
            headers, body
        })
    
        return {
            removeInterval: {
                run: api.postData, ...api.state, ...api.data
            },
        }
    }
}


/**
 * Unshare song with user
 * @param songId song's id
 * @param userId userId of user losing write permission
 */
export const useUnshareSong = (songId: number) => {
    const url = `song/${songId}/shareSong/User`
    const headers = getHeaders()

    const appendUrl = `/`
    const api = useApiService<IUser[]>(url, { headers, appendUrl })

    return {
        unshareSong: { run: api.deleteData, ...api.state },
    }
}

/**
 * Change song protection level (public/private)
 * @param songId song's id
 */
export const useChangeSongProtectionLevel = (songId: number) => {
    const url = `song/${songId}/changeProtectionLevel`
    const headers = getHeaders()
    const body = {}

    const api = useApiService<void>(url, { headers, body })

    return {
        changeSongProtectionLevel: { run: api.postData, ...api.state },
    }
}

/**
 * Get share info about song
 * @param songId song's id
 */
export const useGetSongShareInfo = (songId: number) => {
    const url = `song/${songId}/getProtectionLevelSharedWithAndTags`
    const headers = getHeaders()
    const { getData, state, data } = useApiService<ISongShareData>(url, {
        headers,
    })

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getSongShareInfo: { run: getData, ...state },
        songShareInfo: data,
    }
}
