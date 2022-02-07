import { ISelectedChord } from "../../models/ISelectedChord"
import { ISong } from "../../models/ISong"
import { useMemo } from "react"

export const useSelectedChordAsChord = (
    selectedChord: ISelectedChord | null,
    song: ISong
) => {
    const selectedVoiceBarChord = useMemo(() => {
        if (selectedChord) {
            const voice =
                song.voices.find(
                    (v) => v.songVoiceId === selectedChord.voiceId
                ) || null
            const bar =
                voice?.bars.find((b) => b.barId === selectedChord.barId) || null
            const chord =
                bar?.chords.find((c) => c.chordId === selectedChord.chordId) ||
                null
            return { voice, bar, chord }
        }
        return { voice: null, bar: null, chord: null }
    }, [selectedChord, song.voices])
    return selectedVoiceBarChord
}
