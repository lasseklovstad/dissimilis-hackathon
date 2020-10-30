import { useHistory } from "react-router-dom"
import { useEffect } from "react"
import { IVoice } from "../models/IVoice"

export const useVoice = (voices: IVoice[] | undefined) => {
    const history = useHistory()
    const voiceIdString = new URLSearchParams(history.location.search).get(
        "voice"
    )
    const voiceId = voiceIdString ? parseInt(voiceIdString, 10) : undefined

    useEffect(() => {
        if (voices && voices.length > 0) {
            const resetVoice = () => {
                history.push({
                    ...history.location,
                    search: `voice=${voices[0].songVoiceId}`,
                })
            }

            if (voiceId === undefined) {
                resetVoice()
            } else {
                const valid =
                    voices.findIndex((voice) => voice.songVoiceId === voiceId) >
                    -1

                if (!valid) {
                    resetVoice()
                }
            }
        }
    }, [history, voiceId, voices])

    return voiceId
}
