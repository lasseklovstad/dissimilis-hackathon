import {AbcNotation, Chord as TonalChord} from "@tonaljs/tonal"

export const getNotes = (value: string) => {
    const chord = TonalChord.get(value)
    if (!chord.empty) {
        return chord.notes.map((note) => {
            return AbcNotation.scientificToAbcNotation(note + '4')
        })
    } else {
        alert('Ugyldig akkord')
        return undefined
    }
}