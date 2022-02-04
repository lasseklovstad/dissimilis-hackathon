import React from "react"
import { Box, IconButton } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useTranslation } from "react-i18next"

type BarMenuButtonProps = {
    onMenuClick: (anchorEl: HTMLElement) => void
}

export const BarMenuButton = (props: BarMenuButtonProps) => {
    const { t } = useTranslation()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onMenuClick(event.currentTarget)
    }
    return (
        <Box
            width="0px"
            display="flex"
            position="relative"
            bottom="-40px"
            left="-8px"
            alignItems="flex-end"
        >
            <IconButton
                aria-controls="menuBar"
                aria-haspopup="true"
                onClick={handleClick}
                aria-label={t("Song.barMenu")}
                disableFocusRipple
            >
                <MoreHorizIcon />
            </IconButton>
        </Box>
    )
}
