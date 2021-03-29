import React from "react"
import { Box, IconButton, makeStyles } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { colors } from "../../utils/colors"

type BarMenuButtonProps = {
    onMenuClick: (anchorEl: HTMLElement) => void
}

const useStyles = makeStyles({
    root: { 
        "&:focus": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    },
})

export const BarMenuButton = (props: BarMenuButtonProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.onMenuClick(event.currentTarget)
    }
    const classes = useStyles()
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
                classes={{ root: classes.root }}
                disableFocusRipple
            >
                <MoreHorizIcon />
            </IconButton>
        </Box>
    )
}
