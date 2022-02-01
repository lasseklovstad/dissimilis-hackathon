import {ButtonBase, ButtonBaseProps, styled} from "@mui/material";
import {colors} from "../../utils/colors";

type ChordButtonProps = {
    emptyChord: boolean
    isSelected: boolean
} & ButtonBaseProps
export const ChordButton = styled(ButtonBase, {
    // Configure which props should be forwarded on DOM
    shouldForwardProp: (prop) =>
        prop !== 'emptyChord' && prop !== "isSelected"
})<ChordButtonProps>(({emptyChord, isSelected}) => {

    return {
        display: "flex",
        flexDirection: "column",
        height: "calc(100% - 25px)",
        width: "100%",
        minWidth: 0,
        alignItems: "stretch",
        borderRadius: "3px",
        "&:hover": {
            filter: `brightness(${emptyChord ? "100%" : "80%"})`,
        },
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        ...isSelected && {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        }

    }
});
