import React, { useContext } from "react"
import { Menu, MenuItem } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { IBar } from "../../models/IBar"
import {
    useDeleteBar,
    useDuplicateBar,
    useUpdateBar,
} from "../../utils/useApiServiceSongs"
import { SongContext } from "../../views/SongView/SongContextProvider.component"

type BarMenuProps = {
    bar: IBar
    anchorEl: HTMLElement | null
    onClose: () => void
}

export const BarMenu = (props: BarMenuProps) => {
    const { bar, anchorEl, onClose } = props
    const { deleteBar } = useDeleteBar(bar.songId, bar.songVoiceId, bar.barId)
    const { putBar } = useUpdateBar(bar.songId, bar.songVoiceId, bar.barId)
    const { duplicateBar } = useDuplicateBar(bar.songId)
    const { dispatchSong } = useContext(SongContext)

    const { t } = useTranslation()

    const handleClose = async (method: string) => {
        if (method === "delete") {
            const { error, result } = await deleteBar.run()
            if (!error && result) {
                dispatchSong({ type: "DELETE_BAR", barPosition: bar.position })
            }
        }
        if (method === "duplicate") {
            const { error, result } = await duplicateBar.run({
                fromPosition: bar.position,
                copyLength: 1,
                toPosition: bar.position + 1,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_SONG", song: result.data })
            }
        }
        if (method === "toggleRepBefore") {
            const { error, result } = await putBar.run({
                repBefore: !bar.repBefore,
                repAfter: bar.repAfter,
                house: bar.house,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_VOICE", voice: result.data })
            }
        }
        if (method === "toggleRepAfter") {
            const { error, result } = await putBar.run({
                repBefore: bar.repBefore,
                repAfter: !bar.repAfter,
                house: bar.house,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_VOICE", voice: result.data })
            }
        }
        if (method === "addHouseOne") {
            const { error, result } = await putBar.run({
                repBefore: bar.repBefore,
                repAfter: bar.repAfter,
                house: 1,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_VOICE", voice: result.data })
            }
        }
        if (method === "addHouseTwo") {
            const { error, result } = await putBar.run({
                repBefore: bar.repBefore,
                repAfter: bar.repAfter,
                house: 2,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_VOICE", voice: result.data })
            }
        }
        if (method === "removeHouseOne" || method === "removeHouseTwo") {
            const { error, result } = await putBar.run({
                repBefore: bar.repBefore,
                repAfter: bar.repAfter,
                house: 0,
            })
            if (!error && result) {
                dispatchSong({ type: "UPDATE_VOICE", voice: result.data })
            }
        }
        onClose()
    }

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
                {bar.repBefore
                    ? t("BarContainer:removeRepBefore")
                    : t("BarContainer:addRepBefore")}{" "}
            </MenuItem>
            <MenuItem onClick={() => handleClose("toggleRepAfter")}>
                {bar.repAfter
                    ? t("BarContainer:removeRepAfter")
                    : t("BarContainer:addRepAfter")}{" "}
            </MenuItem>
            <MenuItem
                onClick={() =>
                    handleClose(
                        bar.house === 1 ? "removeHouseOne" : "addHouseOne"
                    )
                }
            >
                {bar.house === 1
                    ? t("BarContainer:removeHouseOne")
                    : t("BarContainer:addHouseOne")}
            </MenuItem>
            <MenuItem
                onClick={() =>
                    handleClose(
                        bar.house === 2 ? "removeHouseTwo" : "addHouseTwo"
                    )
                }
            >
                {bar.house === 2
                    ? t("BarContainer:removeHouseTwo")
                    : t("BarContainer:addHouseTwo")}
            </MenuItem>
        </Menu>
    )
}
