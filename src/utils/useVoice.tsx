import { useHistory } from "react-router-dom"
import { IVoice } from "../models/IVoice"

export const useVoice = (voices: IVoice[] | undefined) => {
    console.log("RUNNING1")
    const history = useHistory()
    const voiceIdString = new URLSearchParams(history.location.search).get(
        "voice"
    )
    const voiceId = voiceIdString ? parseInt(voiceIdString, 10) : undefined

    const voiceExists = voices?.find((voice) => voice.songVoiceId === voiceId)

    const voice =
        !voiceExists && voices && voices?.length > 0
            ? voices[0]
            : voices?.find((voice) => voice.songVoiceId === voiceId)

    return voice
}
