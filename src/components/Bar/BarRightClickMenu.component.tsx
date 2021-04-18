import React, { useEffect, useState } from "react"
import { Menu, MenuItem } from "@material-ui/core"
import { useTranslation } from "react-i18next"

const BarRightClickMenu = (props: {
    barsClipboard:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    selectedBars:
        | {
              fromPosition: number
              toPosition: number
          }
        | undefined
    onSelect: (action: string) => void
    position: { top: number; left: number } | undefined
}) => {
    const [open, setOpen] = useState(false)
    const handleClose = (action: string) => () => {
        props.onSelect(action)
        setOpen(false)
    }
    const { t } = useTranslation()

    useEffect(() => {
        if (props.position) {
            setOpen(true)
        }
    }, [props.position])

    return (
        <Menu
            open={open}
            onClose={() => setOpen(false)}
            anchorReference="anchorPosition"
            anchorPosition={props.position}
        >
            <MenuItem
                id="menuItem"
                disabled={props.selectedBars === undefined}
                tabIndex={-1}
                onClick={handleClose("copy")}
            >
                {t("ChordMenu:copy")}
            </MenuItem>
            <MenuItem
                id="menuItem"
                disabled={
                    props.barsClipboard === undefined ||
                    (props.selectedBars &&
                        props.selectedBars.toPosition >
                            props.selectedBars.fromPosition)
                }
                tabIndex={-1}
                onClick={handleClose("pasteBefore")}
            >
                {t("ChordMenu:pasteBefore")}
            </MenuItem>
            <MenuItem
                id="menuItem"
                disabled={
                    props.barsClipboard === undefined ||
                    (props.selectedBars &&
                        props.selectedBars.toPosition >
                            props.selectedBars.fromPosition)
                }
                tabIndex={-1}
                onClick={handleClose("pasteAfter")}
            >
                {t("ChordMenu:pasteAfter")}
            </MenuItem>
            <MenuItem
                id="menuItem"
                disabled={props.selectedBars === undefined}
                tabIndex={-1}
                onClick={handleClose("delete")}
            >
                {t("ChordMenu:deleteBars")}
            </MenuItem>
        </Menu>
    )
}

export default BarRightClickMenu
