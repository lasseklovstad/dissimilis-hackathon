import { tangentToNumber } from "../../utils/bar.util"

export const isEmptyNote = (note: string) => {
    return note === "Z"
}

export const getNoteText = (note: string, showNoteLetters: boolean) => {
    const tangent = tangentToNumber(note)
    // Should still show notes 1, 2, 3, because they have the same color.
    if (showNoteLetters || typeof tangent === "number") {
        return tangent
    }
    return null
}
