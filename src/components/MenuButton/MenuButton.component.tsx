import React, { useContext, useState } from "react"
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useHistory, useRouteMatch } from "react-router-dom"
import { colors } from "../../utils/colors"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { usePutSong, useDeleteSong } from "../../utils/useApiServiceSongs"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"

const useStyles = makeStyles({
    root: {
        backgroundColor: colors.gray_200,
        borderRadius: "50%",
        height: "48px",
        width: "48px",
        float: "right",
    },
})
export const MenuButton = () => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteSongModalIsOpen, setDeleteSongModalIsOpen] = useState(false)
    const { song, setIsSaving } = useContext(SongContext)
    const { setShowPossiblePositions } = useContext(SongToolsContext)
    const { t } = useTranslation()
    const history = useHistory()
    const { putSong } = usePutSong(song)
    const match = useRouteMatch<{ id: string }>("/song/:id")
    const id = match ? +match.params.id : 0
    const { deleteSong } = useDeleteSong(id)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenDeleteSongModal = () => {
        setDeleteSongModalIsOpen(true)
    }

    const handleDeleteSong = () => {
        setDeleteSongModalIsOpen(false)
        deleteSong().then(() => {
            history.replace("/dashboard")
        })
    }

    const handleClose = (method = "") => {
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        switch (method) {
            case "export":
                setShowPossiblePositions(false)
                putSong().then(() => {
                    history.push(`/song/${id}/export`)
                })

                break
            case "save":
                putSong().then(({ result }) => {
                    if (
                        result &&
                        result.status >= 200 &&
                        result.status <= 299
                    ) {
                        setIsSaving(true)
                    } else {
                        setIsSaving(false)
                    }
                })
                break
            case "delete":
                handleOpenDeleteSongModal()
                break
            default:
        }
    }

    return (
        <div>
            <IconButton
                className={classes.root}
                aria-haspopup="true"
                onClick={handleClick}
                aria-label="Bar menu"
            >
                <MoreHorizIcon />
            </IconButton>
            <Menu
                id="menuBar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => handleClose("")}
                role="menu"
            >
                <MenuItem onClick={() => handleClose("save")}>
                    {t("MenuButton:save")}
                </MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>
                    {t("MenuButton:duplicate")}
                </MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>
                    {t("MenuButton:transpose")}
                </MenuItem>
                <MenuItem onClick={() => handleClose("export")}>
                    {t("MenuButton:export")}
                </MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>
                    {t("MenuButton:hide")}
                </MenuItem>
                <MenuItem onClick={() => handleClose("delete")}>
                    {t("MenuButton:delete")}
                </MenuItem>
            </Menu>
            <ChoiceModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={() => handleDeleteSong()}
                handleClosed={() => handleClose()}
                modalOpen={deleteSongModalIsOpen}
                ackText={t("Modal:deleteSong")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:deleteSong")}
                descriptionText={t("Modal:deleteDescription")}
            />
        </div>
    )
}
