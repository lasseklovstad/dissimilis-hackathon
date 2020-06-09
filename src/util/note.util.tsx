import {AbcNotation} from "@tonaljs/tonal"

const DISSIMILLIS_NOTES = ['C', '4', 'D', '5', 'E', 'F', '1', 'G', '2', 'A', '3', 'B']

export const getNoteText = (note: string) => {
    const match = noteRegex.exec(note)
    noteRegex.exec(note)
    if (match) {
        const prefix = match[1]
        const letter = match[2]
        if (prefix) {
            const basePosition = DISSIMILLIS_NOTES.indexOf(letter.toUpperCase())
            const down = prefix.indexOf('_') > -1
            let finalPosition
            if (down) {
                finalPosition = basePosition - prefix.length
                if (finalPosition < 0) {
                    finalPosition = finalPosition + 11
                }
            } else {
                finalPosition = basePosition + prefix.length
                if (finalPosition > 11) {
                    finalPosition = finalPosition - 11
                }
            }
            return DISSIMILLIS_NOTES[finalPosition]

        } else {
            return letter.toUpperCase() === 'Z' ? '-':letter.toUpperCase()
        }
    }


}

export const COLOR = {
    c: '#00ff00',
    d: '#be42c2',
    e: '#8d320d',
    f: '#fffc38',
    g: '#fb1826',
    a: '#3443e7',
    b: '#fd8c2f',
    default: '#3C3C3C'
}

export const getColor = (note: string) => {
    const letter = getNoteText(note)
    if (!isNaN(letter as any)) {
        return COLOR.default
    } else if (letter) {
        const note = letter.toLowerCase() as 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b'
        return COLOR[note]
    }
}

export const noteRegex = /([_^]*)([A-Za-z])(\/)?(\d+)?/g
// const chordRegex = /\[(([_^]*)([A-Za-z])(\/)?(\d+)?)+\]/g
export const noteAndChordRegex = /((\[(([_^]*[A-Za-z]\/?\d*?)+)\])|(([_^]*)([A-Za-z])(\/)?(\d+)?))/g
export const barLineRegex = /([:\[]?\|[:\d\]]?)/g

export const getNotesLength = (note: string) => {
    let length = 4
    let match = noteRegex.exec(note)
    noteRegex.exec(note)
    if (match) {
        const seperator = match[3]
        const noteLengthValue = match[4]
        if (seperator) {
            const value = noteLengthValue ? parseInt(noteLengthValue) : 2
            return length / value
        } else {
            const value = noteLengthValue ? parseInt(noteLengthValue) : 1
            return length * value
        }
    }

    return length


}

export const getNote = (note:string)=>{
    return AbcNotation.scientificToAbcNotation(note + '4')
}