import {colors} from "../../utils/colors";
import {styled} from "@mui/material";
import {isEmptyNote} from "./Chord.util";

const getColor = (note: string) => {
    switch (note) {
        case "C":
        case "D":
        case "E":
        case "F":
        case "G":
        case "A":
        case "H":
            return colors[note]
        default:
            return colors.blackKeys
    }
}
type NoteProps = {
    note: string
    variant: "main" | "opaque"
    highlight: boolean,
    outline: boolean
}
export const Note = styled('div', {
    // Configure which props should be forwarded on DOM
    shouldForwardProp: (prop) =>
        prop !== 'note' && prop !== 'variant' && prop !== "highlight" && prop !== "outline"
})<NoteProps>(({note, variant, highlight, theme, outline}) => {
    const color = getColor(note)
    const emptyNote = isEmptyNote(note)
    return {
        marginTop: "1px",
        borderRadius: "3px",
        display: "flex",
        flex: "1",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgb(0 0 0 / 12%)",
        color: variant === "main" ? color.text : colors.black,
        backgroundColor: variant === "main" ? color.main : color.opaque,
        ...theme.typography.body1,
        lineHeight: "1",
        "@media(max-width:600px)": {
            fontSize: "0.95rem",
        },
        ...emptyNote && {
            backgroundColor: "transparent"
        },
        ...highlight && {
            backgroundColor: colors.focus,
            filter: `brightness(100%)`
        },
        ...outline && !emptyNote && {
            border: `2px solid ${color.main}`
        }
    }
});
