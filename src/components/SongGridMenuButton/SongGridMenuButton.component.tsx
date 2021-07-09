import React, { useState } from "react"
import { Dialog, IconButton, Menu, MenuItem } from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useDeleteSong, useDuplicateSong } from "../../utils/useApiServiceSongs"
import { ChoiceDialog } from "../CustomModal/ChoiceDialog.component"
import { InputDialog } from "../CustomModal/InputDialog.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"

export const SongGridMenuButton = (props: {
    songId: number
    link: string
    removeSong: (songId: number) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [duplicateSongModalIsOpen, setDuplicateSongModalIsOpen] =
        useState(false)
    const [deleteSongModalIsOpen, setDeleteSongModalIsOpen] = useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = props
    const { deleteSong } = useDeleteSong(songId.toString())
    const { duplicateSong } = useDuplicateSong(songId)

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
            props.removeSong(songId)
        }
    }

    const handleOpenSong = () => {
        history.push(props.link)
    }

    const handleDuplicateSong = async (title: string) => {
        const { error, result } = await duplicateSong.run({
            title,
        })

        if (!error && result) {
            setDuplicateSongModalIsOpen(false)
            history.push(`song/${result.data.songId.toString()}`)
        }
    }

    const handleOpenDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(true)
    }

    const handleCloseDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(false)
    }

    const handleClose = async (method?: "delete" | "copy" | "open") => {
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

    return (
        <>
            <div>
                <IconButton
                    aria-controls="menuBar"
                    aria-haspopup="true"
                    aria-label={t("MenuButton.song")}
                    onClick={handleClick}
                    disableFocusRipple
                >
                    <MoreVertIcon />
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
                        {t("DashboardView.open")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("copy")}>
                        {t("DashboardView.duplicate")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("delete")}>
                        {t("DashboardView.delete")}
                    </MenuItem>
                </Menu>
                <Dialog
                    open={deleteSongModalIsOpen}
                    onClose={() => handleClose()}
                    aria-label={t("Modal.deleteSong")}
                >
                    <ChoiceDialog
                        handleOnCancelClick={() => handleClose()}
                        handleOnSaveClick={handleDeleteSong}
                        ackText={t("Modal.deleteSong")}
                        cancelText={t("Modal.cancel")}
                        headerText={t("Modal.deleteSong")}
                        descriptionText={t("Modal.deleteDescription")}
                    />
                </Dialog>
            </div>
            <Dialog
                open={duplicateSongModalIsOpen}
                onClose={() => handleCloseDuplicateDialog()}
                aria-label={t("DashboardView.duplicateText")}
            >
                <InputDialog
                    handleOnCancelClick={() => handleCloseDuplicateDialog()}
                    handleOnSaveClick={handleDuplicateSong}
                    saveText={t("Modal.create")}
                    cancelText={t("Modal.cancel")}
                    headerText={t("DashboardView.duplicateText")}
                    labelText={t("Modal.newVoiceName")}
                    isLoading={duplicateSong.loading}
                />
            </Dialog>
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Modal.deleteSongLoading")}
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Modal.deleteSongError")}
            />
        </>
    )
}
