import { useHistory, useParams } from "react-router-dom"
import { parse } from "query-string"

export const useVoice = (numberOfVoices: number) => {
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const voiceString = parse(history.location.search)
    let selectedVoice = 0
    if (typeof voiceString.voice === "string") {
        const voiceInt = parseInt(voiceString.voice, 10)
        if (voiceInt > numberOfVoices || voiceInt <= 0) {
            history.replace(`/song/${id}?voice=1`)
        } else {
            selectedVoice = voiceInt - 1
        }
    } else {
        history.replace(`/song/${id}?voice=1`)
    }

    return selectedVoice
}
