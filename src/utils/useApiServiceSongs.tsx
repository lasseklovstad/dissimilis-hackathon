import { useEffect } from "react"
import { useApiService } from "./useApiService"
import {
    ISong,
    ISongIndex,
    ISongMetadata,
    ISongShareData,
} from "../models/ISong"
import { IBar} from "../models/IBar"
import { IVoice, IVoiceDuplicatePost, IVoicePost } from "../models/IVoice"
import { IUser } from "../models/IUser"
import { IGroupIndex } from "../models/IGroup"
import { IOrganisationIndex } from "../models/IOrganisation"
import { ISelectedChord } from "../models/ISelectedChord"
import { IAddComponentIntervallPost } from "../models/IAddComponentIntervall"
import { IRemoveComponentIntervall } from "../models/IRemoveComponentIntervall"
import { IChordPost } from "../models/IChord"

export enum SongProtectionLevel {
    Public = "Public",
    Private = "Private",
}

const getArrangerId = () => {
    return sessionStorage.getItem("userId") || ""
}

/**
 * Get one song
 * @param songId songs id
 */
export const useGetSong = (songId: number) => {
    const url = `song/${songId}`
    const { getData, state, data } = useApiService<ISong>(url)
    useEffect(() => {
        getData()
    }, [getData])
    return {
        getSong: { run: getData, ...state },
        songInit: data,
    }
}

export const useGetVoice = (songId: number, songVoiceId?: number) => {
    const url = `song/${songId}/voice/${songVoiceId}`
    const { getData, state, data } = useApiService<IVoice>(url)
    useEffect(() => {
        if (songVoiceId) {
            getData()
        }
    }, [getData, songVoiceId])
    return {
        getVoice: { run: getData, ...state },
        voiceInit: data,
    }
}

/**
 * Get metadata for one song
 * @param songId songs id
 */
export const useGetSongMetadata = (songId: number) => {
    const url = `song/${songId}/metadata`
    const { getData, state, data } = useApiService<ISongMetadata>(url)
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
    const { postData, state, data } = useApiService<ISong>(url, {
        body,
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
    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        body,
        initialData,
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
    includedOrganisationIdArray: string[],
    includedGroupIdArray: string[],
    orderTerm: string,
    orderDescending: boolean,
    numberOfResults?: string
) => {
    const url = "song/search"
    const initialData: ISongIndex[] = []
    const body = {
        maxNumberOfSongs: numberOfResults,
        title,
        orderBy: orderTerm,
        orderDescending,
        includedOrganisationIdArray,
        includedGroupIdArray,
    }

    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        initialData,
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
    const { postData, state, data } = useApiService<ISongIndex[]>(url, {
        body,
        initialData,
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
    const api = useApiService<ISong>(url)
    return {
        postSong: { run: api.postData, ...api.state },
    }
}

/**
 * Post exisitng song
 */
export const useUpdateSong = (songId: number) => {
    const url = `song/${songId}`
    const api = useApiService<ISong>(url)
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
    const api = useApiService<ISong>(url)
    return {
        deleteSong: { run: api.deleteData, ...api.state },
    }
}

export const useCreateVoice = (songId: number) => {
    const url = `song/${songId}/voice`
    const api = useApiService<IVoice, IVoicePost>(url)
    return {
        postVoice: { run: api.postData, ...api.state },
    }
}

export const useDuplicateVoice = (
    songId: number,
    voiceId: number | undefined
) => {
    const url = `song/${songId}/voice/${voiceId}/duplicate`
    const api = useApiService<IVoice, IVoiceDuplicatePost>(url)
    return {
        duplicateVoice: { run: api.postData, ...api.state },
    }
}

export const useUpdateVoice = (songId: number, voiceId: number | undefined) => {
    const url = `song/${songId}/voice/${voiceId}`
    const api = useApiService<IVoice>(url)
    return {
        putVoice: { run: api.putData, ...api.state },
    }
}

export const useDeleteVoice = (songId: number, voiceId: number | undefined) => {
    const url = `song/${songId}/voice/${voiceId}`
    const api = useApiService<void>(url)
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
    const api = useApiService<IBar>(url)

    return {
        postChord: { run: api.postData, ...api.state },
    }
}

export const useCopyBars = (songId: number | undefined) => {
    const url = `song/${songId}/copyBars`

    const api = useApiService<ISong>(url)
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

    const api = useApiService<ISong>(url)
    return {
        postDeleteBars: {
            run: (body: { fromPosition: number; deleteLength: number }) =>
                api.postData(body),
            ...api.state,
        },
    }
}

export const useDeleteChord = () => {
    const api = useApiService<IBar>("")
    const run = ({ songId, voiceId, barId, chordId }: ISelectedChord) => {
        const url = `song/${songId}/voice/${voiceId}/bar/${barId}/note/${chordId}`
        return api.deleteData(url)
    }

    return {
        deleteChord: { run, ...api.state },
    }
}

export const useUpdateChord = () => {
    const api = useApiService<IBar>("")
    const run = (
        { songId, voiceId, barId, chordId }: ISelectedChord,
        body: IChordPost
    ) => {
        const url = `song/${songId}/voice/${voiceId}/bar/${barId}/note/${chordId}`
        return api.putData(body, url)
    }
    return {
        updateChord: { run, ...api.state },
    }
}

export const useAddNote = (
    songId: number,
    voiceId: number,
    barPosition: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barPosition}/note/addComponentInterval`
    const api = useApiService<IBar>(url)

    const run = (body: IAddComponentIntervallPost) => {
        return api.postData(body)
    }

    return {
        addNote: { run, ...api.state },
    }
}

export const useRemoveNote = (
    songId: number,
    voiceId: number,
    barPosition: number
) => {
    const url = `song/${songId}/voice/${voiceId}/bar/${barPosition}/note/removeComponentInterval`
    const api = useApiService<IBar>(url)

    const run = (body: IRemoveComponentIntervall) => {
        return api.postData(body)
    }

    return {
        removeNote: { run, ...api.state },
    }
}

export const useAddBar = (songId: number, voiceId: number) => {
    const url = `song/${songId}/voice/${voiceId}/bar`
    const body = {
        repBefore: false,
        repAfter: false,
        voltaBracket: 0,
    }
    const api = useApiService<ISong>(url, { body })

    return {
        postBar: { run: api.postData, ...api.state },
    }
}

export const useDuplicateBar = (songId: number) => {
    const url = `song/${songId}/copyBars`
    const api = useApiService<ISong>(url)
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
    const api = useApiService<IVoice>(url)

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
    const api = useApiService<IVoice>(url)

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

    const api = useApiService<ISong>(url)

    return {
        duplicateSong: { run: api.postData, ...api.state },
    }
}

export const useUndoSong = (songId: number) => {
    const url = `song/${songId}/undo`

    const api = useApiService<ISong>(url)

    return {
        undoSong: { run: api.putData, ...api.state },
    }
}
/**
 * Set group tags for song
 * @param songId song's id
 */
export const useSetGroupTags = (songId: number) => {
    const url = `song/${songId}/Tag/Group`

    const emptyGroupTags: number[] = []
    const body = {
        tagIds: emptyGroupTags,
    }

    const api = useApiService<IGroupIndex>(url, { body })

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

    const emptyOrganisationTags: number[] = []
    const body = {
        tagIds: emptyOrganisationTags,
    }

    const api = useApiService<IOrganisationIndex>(url, { body })

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

    const appendUrl = "/"
    const api = useApiService<IUser[]>(url, { appendUrl })

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
    const url = `song/${songId}/voice/${voiceId}/addComponentInterval`

    const body = {
        intervalPosition: 0,
        sourceVoiceId: 0,
    }

    const api = useApiService<IVoice>(url, {
        body,
    })

    return {
        addInterval: { run: api.postData, ...api.state, ...api.data },
    }
}
/**
 * remove component interval voice
 * @param songId
 * @param voiceId
 */
export const useRemoveComponentInterval = (songId: number, voiceId: number) => {
    const url = `song/${songId}/voice/${voiceId}/RemoveComponentInterval`

    const body = {
        intervalPosition: 0,
        deleteChordsOnLastIntervalRemoved: true,
    }

    const api = useApiService<IVoice>(url, {
        body,
    })

    return {
        removeInterval: {
            run: api.postData,
            ...api.state,
            ...api.data,
        },
    }
}

/**
 * Unshare song with user
 * @param songId song's id
 * @param userId userId of user losing write permission
 */
export const useUnshareSong = (songId: number) => {
    const url = `song/${songId}/shareSong/User`

    const appendUrl = "/"
    const api = useApiService<IUser[]>(url, { appendUrl })

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

    const body = {}

    const api = useApiService<void>(url, { body })

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

    const { getData, state, data } = useApiService<ISongShareData>(url)

    useEffect(() => {
        getData()
    }, [getData])

    return {
        getSongShareInfo: { run: getData, ...state },
        songShareInfo: data,
    }
}
