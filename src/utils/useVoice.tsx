import { useLocation } from "react-router-dom"
import { IVoice } from "../models/IVoice"

export const useVoice = (voices: IVoice[] | undefined) => {
    const location = useLocation()
    const voiceIdString = new URLSearchParams(location.search).get("voice")
    const voiceId = voiceIdString ? parseInt(voiceIdString, 10) : undefined

    const voiceExists = voices?.find((voice) => voice.songVoiceId === voiceId)

    const voice =
        !voiceExists && voices && voices?.length > 0
            ? voices[0]
            : voices?.find((voice) => voice.songVoiceId === voiceId)

    return voice
}
