import React, { useContext } from "react"
import { Menu, MenuItem } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { SongContext } from "../../views/SongView/SongContextProvider.component"

type BarMenuProps = {
    voiceId: number
    barNumber: number | undefined
    anchorEl: HTMLElement | null
    onClose: () => void
}

export const BarMenu = (props: BarMenuProps) => {
    const { barNumber, voiceId, anchorEl, onClose } = props
    const {
        deleteBar,
        duplicateBar,
        toggleRepBefore,
        toggleRepAfter,
        addHouse,
        deleteHouse,
        song: { voices },
    } = useContext(SongContext)

    const { t } = useTranslation()

    if (!barNumber) {
        return <></>
    }

    const handleClose = (method: string) => {
        const index = barNumber - 1
        if (method === "delete") {
            deleteBar(index, voiceId)
        }
        if (method === "duplicate") {
            duplicateBar(index, voiceId)
        }
        if (method === "toggleRepBefore") {
            toggleRepBefore(index)
        }
        if (method === "toggleRepAfter") {
            toggleRepAfter(index)
        }
        if (method === "addHouse") {
            addHouse(index)
        }
        if (method === "removeHouse") {
            deleteHouse(index)
        }
        onClose()
    }

    // checks if a bar has a house connected to it
    const barConst =
        voices[0].bars[barNumber - 1].house !== undefined &&
        voices[0].bars[barNumber - 1].house !== null

    return (
        <Menu
            id="menuBar"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            role="menu"
        >
            <MenuItem onClick={() => handleClose("delete")}>
                {t("BarContainer:deleteBar")}{" "}
            </MenuItem>
            <MenuItem onClick={() => handleClose("duplicate")}>
                {t("BarContainer:duplicateBar")}{" "}
            </MenuItem>
            <MenuItem onClick={() => handleClose("toggleRepBefore")}>
                {voices[0].bars[barNumber - 1].repBefore
                    ? t("BarContainer:removeRepBefore")
                    : t("BarContainer:addRepBefore")}{" "}
            </MenuItem>
            <MenuItem onClick={() => handleClose("toggleRepAfter")}>
                {voices[0].bars[barNumber - 1].repAfter
                    ? t("BarContainer:removeRepAfter")
                    : t("BarContainer:addRepAfter")}{" "}
            </MenuItem>
            <MenuItem
                disabled={barNumber - 1 === 0 && voices[0].bars.length === 1}
                onClick={() =>
                    handleClose(barConst ? "removeHouse" : "addHouse")
                }
            >
                {barConst
                    ? t("BarContainer:removeHouse")
                    : t("BarContainer:addHouse")}
            </MenuItem>
        </Menu>
    )
}
