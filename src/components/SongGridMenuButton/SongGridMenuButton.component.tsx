import React, { useState } from "react"
import { IconButton, Menu, MenuItem } from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import {
    useDeleteSong,
    useDuplicateSong,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { InputModal } from "../CustomModal/InputModal.component"
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
    const [songInfoModalIsOpen, setSongInfoModalIsOpen] = useState(false)
    const [title] = useState<"title" | "song" | "user">("title")
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = props
    const { deleteSong } = useDeleteSong(songId.toString())
    const { duplicateSong } = useDuplicateSong(songId)
    const { putSong } = useUpdateSong(songId.toString())
    // songId is sometimes a number, sometimes a string (why?):
    //const { updateSongInfo } = useUpdateSong()

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

    const handleSaveSongInfo = async (title: string) => {
        const { error, result } = await putSong.run({
            title,
        })

        if (!error && result) {
            setSongInfoModalIsOpen(false)
            history.push(`song/${result.data.songId.toString()}`) // hakke peiling hva som skjer her
        }
    }

    const handleOpenDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(true)
    }

    const handleCloseDuplicateDialog = () => {
        setDuplicateSongModalIsOpen(false)
    }

    const handleOpenSongInfoModal = () => {
        setSongInfoModalIsOpen(true)
    }

    const handleCloseSongInfoModal = () => {
        setSongInfoModalIsOpen(false)
    }

    const handleClose = async (
        method?: "delete" | "copy" | "info" | "open"
    ) => {
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        switch (method) {
            case "delete":
                handleOpenDeleteSongModal()
                break
            case "copy":
                handleOpenDuplicateDialog()
                break
            case "info":
                handleOpenSongInfoModal()
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
                    <MenuItem onClick={() => handleClose("info")}>
                        {t("DashboardView.showInfo")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("copy")}>
                        {t("DashboardView.duplicate")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("delete")}>
                        {t("DashboardView.delete")}
                    </MenuItem>
                </Menu>
                <ChoiceModal
                    handleOnCancelClick={() => handleClose()}
                    handleClosed={() => handleClose()}
                    handleOnSaveClick={handleDeleteSong}
                    ackText={t("Modal.deleteSong")}
                    modalOpen={deleteSongModalIsOpen}
                    cancelText={t("Modal.cancel")}
                    headerText={t("Modal.deleteSong")}
                    descriptionText={t("Modal.deleteDescription")}
                />
            </div>
            <InputModal
                handleOnCancelClick={() => handleCloseDuplicateDialog()}
                handleOnSaveClick={handleDuplicateSong}
                handleClosed={() => handleCloseDuplicateDialog()}
                modalOpen={duplicateSongModalIsOpen}
                saveText={t("Modal.create")}
                cancelText={t("Modal.cancel")}
                headerText={t("DashboardView.duplicateText")}
                labelText={t("Modal.newVoiceName")}
                isLoading={duplicateSong.loading}
            />
            <InputModal
                handleOnCancelClick={() => handleCloseSongInfoModal()}
                handleOnSaveClick={handleSaveSongInfo}
                handleClosed={() => handleCloseDuplicateDialog()}
                modalOpen={songInfoModalIsOpen}
                saveText={t("Modal.save")}
                cancelText={t("Modal.cancel")}
                headerText={t("DashboardView.info")}
                labelText={t("Modal.nameOfSong")}
                isLoading={putSong.loading}
            />
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
