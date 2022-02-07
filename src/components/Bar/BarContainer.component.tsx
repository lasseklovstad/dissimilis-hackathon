import { Box, ButtonBase, ButtonBaseProps } from "@mui/material"
import { ReactNode } from "react"
import { colors } from "../../utils/colors"

type BarContainerButtonProps = {
    selected?: boolean
} & Pick<ButtonBaseProps, "onClick" | "onContextMenu">

type BarContainerProps = {
    height?: number
    children?: ReactNode
    buttonProps?: BarContainerButtonProps
    button?: boolean
    "aria-label"?: string
}

export const BarContainer = (props: BarContainerProps) => {
    const {
        height,
        children,
        buttonProps = { selected: false },
        button = false,
    } = props

    const commonSx = {
        height: height || "100%",
        display: "flex",
        minWidth: 0,
        borderRadius: "5px",
        padding: "3px 0px 3px 0px",
        width: "100%",
        position: "relative" as const,
    }

    if (!button) {
        return (
            <Box aria-label={props["aria-label"]} sx={commonSx}>
                {children}
            </Box>
        )
    }

    return (
        <ButtonBase
            aria-label={props["aria-label"]}
            aria-selected={buttonProps.selected}
            disableRipple
            sx={{
                ...commonSx,
                boxShadow: `0 0 0px 4px ${colors.gray_400}`,
                backgroundColor: colors.gray_200,
                "&:hover, :focus": {
                    boxShadow: `0 0 0px 4px ${colors.focus}`,
                },
                "&[aria-selected=true]": {
                    boxShadow: `0 0 0px 4px ${colors.focus}`,
                    backgroundColor: colors.teal_100,
                },
            }}
            onClick={buttonProps.onClick}
            onContextMenu={buttonProps.onContextMenu}
        >
            {children}
        </ButtonBase>
    )
}
