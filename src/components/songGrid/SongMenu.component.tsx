import React, { useState } from "react"
import { IconButton, Menu, MenuItem, Box } from "@material-ui/core"
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
    const [duplicateSongModalIsOpen, setDuplicateSongModalIsOpen] = useState(false)
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
            window.location.reload()
        }
    }
    const handleOpenSong = () => {
        history.push(props.link)
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

    const handleDuplicateSong = async (title: string) => {
        const { error, result } = await duplicateSong.run({
            title,
        })
        
        if(!error && result) {
            setDuplicateSongModalIsOpen(false)
            history.push(result.data.songId.toString())
        }
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
                    <MoreVertIcon/>
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
            </div>
            <InputModal
                    handleOnCancelClick={() => handleCloseDuplicateDialog()}
                    handleOnSaveClick={handleDuplicateSong}
                    handleClosed={() => handleCloseDuplicateDialog()}
                    modalOpen={duplicateSongModalIsOpen}
                    saveText={t("Modal:create")}
                    cancelText={t("Modal:cancel")}
                    headerText={t("DashboardView:duplicateText")}
                    labelText={t("Modal:newVoiceName")}
                />
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Modal:deleteSongLoading")}
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Modal:deleteSongError")}
            />
        </>
    )
}