import { colors } from "./colors"
import { ITimeSignature } from "../models/ITimeSignature"

export const getColor = (note: string): string => {
    let newColor = "transparent"
    switch (note) {
        case "C":
            newColor = colors.C.main
            break
        case "D":
            newColor = colors.D.main
            break
        case "E":
            newColor = colors.E.main
            break
        case "F":
            newColor = colors.F.main
            break
        case "G":
            newColor = colors.G.main
            break
        case "A":
            newColor = colors.A.main
            break
        case "H":
            newColor = colors.H.main
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
