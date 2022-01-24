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
