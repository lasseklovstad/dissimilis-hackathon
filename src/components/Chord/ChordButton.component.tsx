import { ButtonBase, ButtonBaseProps, styled } from "@mui/material"
import { colors } from "../../utils/colors"
import { chordStyles } from "./ChordAsBox.component"

type ChordButtonProps = {
    emptyChord: boolean
} & ButtonBaseProps
export const ChordButton = styled(ButtonBase, {
    // Configure which props should be forwarded on DOM
    shouldForwardProp: (prop) => prop !== "emptyChord",
})<ChordButtonProps>(({ emptyChord }) => {
    return {
        ...chordStyles,
        "&:hover": {
            filter: `brightness(${emptyChord ? "100%" : "80%"})`,
        },
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        "&[aria-selected=true]": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    }
})
