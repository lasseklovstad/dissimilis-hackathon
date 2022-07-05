import { useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useGetGenerateSong } from "./useApiServiceSongs"
import { useSongContext } from "../context/song/SongContextProvider.component"
import { useMetronome } from "./useMetronome.util"
import { useChordMenuOptionsContext } from "../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"

// return millis ber bar
export const getTimePerBar = (bpm: number, numerator: number) => {
    return (1000 * numerator) / (bpm / 60)
}

export const usePlaySong = (
    barsPerRow: number,
    numberOfBars: number,
    songId: number
) => {
    // num er oppe
    // den er nede
    const {
        song: { speed, numerator },
    } = useSongContext()
    const time = getTimePerBar(speed, numerator)
    const { getSong, songFile } = useGetGenerateSong(songId)
    const { setChordMenuOptions } = useChordMenuOptionsContext()
    const [playPosition, setPlayPosition] = useState(-1)
    const playPositionRef = useRef(-1)
    const audioRef = useRef<HTMLAudioElement>()
    const playIntervalRef = useRef<NodeJS.Timeout>()
    const play = () => {
        playPositionRef.current = barsPerRow
        setPlayPosition(playPositionRef.current)
        playIntervalRef.current = setInterval(() => {
            if (playPositionRef.current >= numberOfBars) {
                playPositionRef.current = -1
                setPlayPosition(playPositionRef.current)
                playIntervalRef.current &&
                    clearInterval(playIntervalRef.current)
                audioRef.current?.pause()
            } else {
                playPositionRef.current = playPositionRef.current + barsPerRow
                setPlayPosition(playPositionRef.current)
            }
        }, time * barsPerRow)
    }
    useHotkeys("ctrl+Space", () => {
        if (playPositionRef.current > 0) {
            setChordMenuOptions((options) => ({
                ...options,
                playMetronome: !options.playMetronome,
            }))
            audioRef.current?.pause()
            playPositionRef.current = -1
            setPlayPosition(playPositionRef.current)
            // audioRef.current?.pause()
            playIntervalRef.current && clearInterval(playIntervalRef.current)
        } else {
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play()
                play()
                setChordMenuOptions((options) => ({
                    ...options,
                    playMetronome: !options.playMetronome,
                }))
            } else {
                getSong.run().then((response) => {
                    if (!response.result?.data) return
                    const objectUrl = URL.createObjectURL(response.result?.data)
                    audioRef.current = new Audio()
                    audioRef.current.src = objectUrl
                    audioRef.current.currentTime = 0
                    audioRef.current.play()
                    play()
                    setChordMenuOptions((options) => ({
                        ...options,
                        playMetronome: !options.playMetronome,
                    }))
                })
            }
        }
    })

    return { playPosition }
}
