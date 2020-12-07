import React, { useState } from "react"
import { IconButton, Menu, MenuItem } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { colors } from "../../utils/colors"
import { useDeleteSong, useDuplicateSong } from "../../utils/useApiServiceSongs"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { InputModal } from "../CustomModal/InputModal.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"

export const SongMenu = (props: { songId: number; link: string }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [duplicateSongTitle, setDuplicateSongTitle] = useState("")
    const [duplicateSongModalIsOpen, setDuplicateSongModalIsOpen] = useState(false)
    const [deleteSongModalIsOpen, setDeleteSongModalIsOpen] = useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = props
    const { deleteSong } = useDeleteSong(songId.toString())
    const { duplicateSong } = useDuplicateSong(songId, duplicateSongTitle)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenDeleteSongModal = () => {
        setDeleteSongModalIsOpen(true)
    }

    const handleDeleteSong = async () => {
        setDeleteSongModalIsOpen(false)
        const { isError } = await deleteSong.run()
        if (!isError) {
            history.replace("/dashboard")
        }
    }
    const handleOpenSong = () => {
        history.push(props.link)
    }

    const handleClose = async (method?: "delete" | "copy" | "open") => {
        console.log(songId, typeof (songId))
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        switch (method) {
            case "delete":
                handleOpenDeleteSongModal()
                break
            case "copy":
                handleOpenDuplicateDialog()
                break
            case "open":
                handleOpenSong()
                break
            default:
                break
        }
    }

    const handleDuplicateSong = () => {
        handleOpenDuplicateDialog()
    }

    const handleOpenDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(true);
    };

    const handleCloseDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(false);
    };

    return (
        <>
            <div>
                <IconButton
                    aria-controls="menuBar"
                    aria-haspopup="true"
                    aria-label="Bar options"
                    onClick={handleClick}
                >
                    <MoreHorizIcon />
                </IconButton>
                <Menu
                    id="menuBar"
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={() => handleClose()}
                    role="menu"
                >
                    <MenuItem onClick={() => handleClose("open")}>
                        {t("DashboardView:open")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("copy")}>
                        {t("DashboardView:duplicate")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("delete")}>
                        {t("DashboardView:delete")}
                    </MenuItem>
                </Menu>
                <ChoiceModal
                    handleOnCancelClick={() => handleClose()}
                    handleClosed={() => handleClose()}
                    handleOnSaveClick={handleDeleteSong}
                    ackText={t("Modal:deleteSong")}
                    modalOpen={deleteSongModalIsOpen}
                    cancelText={t("Modal:cancel")}
                    headerText={t("Modal:deleteSong")}
                    descriptionText={t("Modal:deleteDescription")}
                />
                <InputModal
                    handleOnCancelClick={() => handleCloseDuplicateDialog()}
                    handleOnSaveClick={handleDuplicateSong}
                    handleClosed={() => handleCloseDuplicateDialog()}
                    modalOpen={duplicateSongModalIsOpen}
                    saveText={t("Modal:create")}
                    cancelText={t("Modal:cancel")}
                    headerText={t("DashboardView:duplicateText")}
                    labelText={t("DashboardView:duplicateText")}
                />
            </div>
        </>
    )
}