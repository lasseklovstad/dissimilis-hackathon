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

export const getColor = (note: string, highlight: boolean): string => {
    let newColor = "transparent"
    switch (note) {
        case "C":
            newColor = highlight? colors.C.dark : colors.C.main
            break
        case "D":
            newColor = highlight? colors.D.dark : colors.D.main
            break
        case "E":
            newColor = highlight? colors.E.dark : colors.E.main
            break
        case "F":
            newColor = highlight? colors.F.dark : colors.F.main
            break
        case "G":
            newColor = highlight? colors.G.dark : colors.G.main
            break
        case "A":
            newColor = highlight? colors.A.dark : colors.A.main
            break
        case "H":
            newColor = highlight? colors.H.dark : colors.H.main
            break
        case "C#":
        case "D#":
        case "F#":
        case "G#":
        case "A#":
            newColor = highlight? colors.gray_500_dark : colors.gray_500
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
