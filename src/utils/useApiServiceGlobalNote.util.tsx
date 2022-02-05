import { useApiService } from "./useApiService"
import { useEffect } from "react"
import { IOptions } from "../models/IOptions"
import { IIntervals } from "../models/IIntervals"

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
