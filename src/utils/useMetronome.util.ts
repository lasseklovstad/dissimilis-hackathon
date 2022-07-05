import { getTimePerBar, usePlaySong } from "./usePlaySong.util"
import { usePlaySound } from "./usePlaySound.util"
import { useSongContext } from "../context/song/SongContextProvider.component"
import { useRef, useState } from "react"

export const useMetronome = () => {
    const {
        song: { speed, numerator },
    } = useSongContext()
    const timePerBar = getTimePerBar(speed, numerator)
    const [playing, setPlaying] = useState(false)
    const [, toggleSound1] = usePlaySound("/snare-stick.wav")
    const [, toggleSound2] = usePlaySound("/snare-drum-cross-stick.wav")
    const playIntervalRef = useRef<NodeJS.Timeout>()
    const playTimeoutRef = useRef<NodeJS.Timeout[]>([])

    const playBar = () => {
        const timeBetweenBeats = timePerBar / numerator
        toggleSound1()
        for (let i = 1; i < numerator; i++) {
            playTimeoutRef.current.push(
                setTimeout(() => {
                    toggleSound2()
                }, timeBetweenBeats * i)
            )
        }
    }

    const start = () => {
        setPlaying(true)
        playBar()
        playIntervalRef.current = setInterval(() => {
            playBar()
        }, timePerBar)
    }

    const stop = () => {
        setPlaying(false)
        playIntervalRef.current && clearInterval(playIntervalRef.current)
        if (playTimeoutRef.current.length) {
            playTimeoutRef.current.forEach((timeout) => clearTimeout(timeout))
            playTimeoutRef.current = []
        }
    }

    const toggle = () => {
        if (playing) {
            stop()
        } else {
            start()
        }
    }

    return [playing, toggle] as const
}
