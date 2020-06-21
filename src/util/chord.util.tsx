import {AbcNotation, Chord as TonalChord} from "@tonaljs/tonal"
import {noteRegex} from "./note.util"

export const getNotes = (value: string) => {
    const chord = TonalChord.get(value)
    if (!chord.empty) {
        return chord.notes.map((note) => {
            return AbcNotation.scientificToAbcNotation(note + '4')
        })
    } else {
        return undefined
    }
}

export const getChord = (abcNotes: string | undefined) => {
    if (!abcNotes) return ''
    const notes = abcNotes.match(noteRegex)?.map(note => note.replace(/[/\d*]/g, '')).map(note => AbcNotation.abcToScientificNotation(note))
    if (notes && notes.length > 1) {
        return TonalChord.detect(notes)[0]
    } else {
        return notes && notes[0].replace(/[\d*]/g, '')
    }
}