import { Chord as TonalChord } from "@tonaljs/tonal"
import { colors } from "./colors"
import { ITimeSignature } from "../models/ITimeSignature"

/* Gets the chord based on notes. The package we use (tonaljs) uses the tone "B" instead of "H" so we need
to replace H with B to get the right chord.
*/
export const getChord = (notes: string[]): string => {
    if (notes.length === 1) {
        return notes[0]
    }
    const result = TonalChord.detect(
        notes.map((note) => {
            return note === "H" ? "B" : note
        })
    )
    if (result.length === 0) return notes[0]
    return result[0].replace(/M/g, "").replace(/B/g, "H")
}

export const getColor = (note: string): string => {
    let newColor = "transparent"
    switch (note) {
        case "C":
            newColor = colors.C
            break
        case "D":
            newColor = colors.D
            break
        case "E":
            newColor = colors.E
            break
        case "F":
            newColor = colors.F
            break
        case "G":
            newColor = colors.G
            break
        case "A":
            newColor = colors.A
            break
        case "H":
            newColor = colors.H
            break
        case "C#":
        case "D#":
        case "F#":
        case "G#":
        case "A#":
            newColor = colors.gray_500
            break
        default:
            newColor = ""
    }
    return newColor
}

export const tangentToNumber = (tangent: string): number | string => {
    switch (tangent) {
        case "C#":
            return 4
        case "D#":
            return 5
        case "F#":
            return 1
        case "G#":
            return 2
        case "A#":
            return 3
        case "Z":
            return ""
        default:
            return tangent
    }
}

export const getTimeSignatureText = (timeSignature: ITimeSignature) => {
    return `${timeSignature.numerator}/${timeSignature.denominator}`
}
