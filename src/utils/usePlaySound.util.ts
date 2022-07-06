import { useEffect, useState } from "react"
import { useApiService } from "./useApiService"
import { IUpdateSongResponse } from "../models/ISong"

export const usePlaySound = (url: string) => {
    const { getData } = useApiService<Blob>(url, {
        type: "blob",
        includeApiPrefix: false,
    })

    useEffect(() => {
        getData().then((response) => {
            if (response.result?.data) {
                const objectUrl = URL.createObjectURL(response.result.data)
                setAudio(new Audio(objectUrl))
            }
        })
    }, [getData])

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
    const [playing, setPlaying] = useState(false)

    const play = () => {
        if (audio) {
            setPlaying(true)
            audio.currentTime = 0
            audio.play()
        }
    }

    const stop = () => {
        if (audio) {
            setPlaying(true)
            audio.currentTime = 0
            audio.pause()
        }
    }

    useEffect(() => {
        audio?.addEventListener("ended", () => setPlaying(false))
        return () => {
            audio?.removeEventListener("ended", () => setPlaying(false))
        }
    }, [audio])

    return [playing, play, stop] as const
}
