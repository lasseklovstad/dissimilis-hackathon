import React, { useEffect, useState } from "react"
import { Menu, MenuItem } from "@material-ui/core"

type ChordMenuProps = {
    position: { top: number; left: number } | undefined
    onSelect: (action: "delete") => void
}

export const ChordMenu = (props: ChordMenuProps) => {
    const { position, onSelect } = props
    const [open, setOpen] = useState(false)

    const handleClose = (action: "delete") => () => {
        onSelect(action)
        setOpen(false)
    }

    useEffect(() => {
        if (position) {
            setOpen(true)
        }
    }, [position])

    return (
        <Menu
            open={open}
            onClose={() => setOpen(false)}
            anchorReference="anchorPosition"
            anchorPosition={position}
        >
            <MenuItem tabIndex={-1} onClick={handleClose("delete")}>
                Slett
            </MenuItem>
        </Menu>
    )
}
