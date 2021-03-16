import { useHistory } from "react-router-dom"
import { IVoice } from "../models/IVoice"

export const useVoice = (voices: IVoice[] | undefined) => {
    const history = useHistory()
    const voiceIdString = new URLSearchParams(history.location.search).get(
        "voice"
    )
    const voiceId = voiceIdString ? parseInt(voiceIdString, 10) : undefined

    const voiceExists = voices?.find((voice) => voice.songVoiceId === voiceId)

    if (!voiceExists && voices && voices?.length > 0) {
        return voices[0].songVoiceId
    }

    return voiceId
}
