import { IChord } from "../../models/IChord"

export const fillBarWithEmptyChords = (chords: IChord[]) => {
    return chords.reduce((noter: IChord[], note) => {
        if (note.notes[0] === "Z") {
            const numberOfRests = note.length
            const rests = []
            for (let i = 0; i < numberOfRests; i++) {
                rests.push({
                    length: 1,
                    notes: ["Z" as const],
                    position: note.position + i,
                    chordId: null,
                    chordName: "",
                })
            }
            return [...noter, ...rests]
        }
        return [...noter, note]
    }, [])
}
