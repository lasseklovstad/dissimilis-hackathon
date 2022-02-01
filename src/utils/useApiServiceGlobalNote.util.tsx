import { useApiService } from "./useApiService"
import { useEffect } from "react"

interface IOptions {
    singleNoteOptions: string[]
    chordOptions: string[]
}

export const useOptions = () => {
    const { getData, state, data } = useApiService<IOptions>("note/options")
    useEffect(() => {
        getData()
    }, [getData])
    return {
        state,
        optionData: data || { singleNoteOptions: [], chordOptions: [] },
    }
}

interface IIntervals {
    intervalNames: string[]
}

export const useGetChordIntervals = (chordName: string) => {
    const { getData, state, data } = useApiService<IIntervals>(
        "note/chord/intervalNames",
        { params: { chordName } }
    )
    useEffect(() => {
        getData()
    }, [getData])
    return {
        state,
        chordIntervalsData: data,
    }
}
