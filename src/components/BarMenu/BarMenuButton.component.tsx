import React from "react"
import { Box, IconButton } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"

type BarMenuButtonProps = {
    onMenuClick: (anchorEl: HTMLElement) => void
}

export const BarMenuButton = (props: BarMenuButtonProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onMenuClick(event.currentTarget)
    }
    return (
        <Box
            width="0px"
            display="flex"
            position="relative"
            bottom="-47px"
            left="-11px"
            alignItems="flex-end"
        >
            <IconButton
                aria-controls="menuBar"
                aria-haspopup="true"
                onClick={handleClick}
                aria-label="Bar options"
            >
                <MoreHorizIcon />
            </IconButton>
        </Box>
    )
}
