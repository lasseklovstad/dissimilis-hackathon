import React, { useState } from "react"
import {
    Dialog,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { colors } from "../../utils/colors"
import {
    useDeleteSong,
    useDuplicateSong,
    useTransposeSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { TransposeDialog } from "../CustomDialog/TransposeDialog.component"
import { InputDialog } from "../CustomDialog/InputDialog.component"

export const MenuButton = (props: {
    voiceId: number
    showName: boolean
    user?: string
    setBarEditMode: () => void
    barEditMode: boolean
    onLogout: () => void
    songTitle: string
}) => {
    const { songTitle } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteSongDialogIsOpen, setDeleteSongDialogIsOpen] = useState(false)
    const [duplicateSongDialogIsOpen, setDuplicateSongDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId, title, transpose } = useParams<{
        songId: string
        title: string
        transpose: string
    }>()
    const { deleteSong } = useDeleteSong(songId)
    const [transposeSongDialogIsOpen, setTransposeSongDialogIsOpen] =
        useState(false)
    const { transposeSong } = useTransposeSong(songId, title, transpose)
    const { duplicateSong } = useDuplicateSong(Number(songId))

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDeleteSong = async () => {
        setDeleteSongDialogIsOpen(false)
        const { isError } = await deleteSong.run()
        if (!isError) {
            history.replace("/dashboard")
        }
    }

    const exportSong = async () => {
        history.push(`/song/${songId}/export?voice=${props.voiceId}`)
    }

    const handleOpenTransposeSongDialog = async () => {
        setTransposeSongDialogIsOpen(true)
    }

    const handleTransposeSong = async (title: string, transpose: string) => {
        const { isError, result } = await transposeSong.run({
            title,
            transpose,
        })
        if (!isError) {
            history.push(`/song/${result?.data?.songId}`)
        }
    }

    const handleClose = async (
        method?: "transpose" | "export" | "delete" | "duplicate" | "editBars"
    ) => {
        setAnchorEl(null)
        setDeleteSongDialogIsOpen(false)
        setTransposeSongDialogIsOpen(false)
        switch (method) {
            case "transpose":
                handleOpenTransposeSongDialog()
                break
            case "export":
                await exportSong()
                break
            case "delete":
                setDeleteSongDialogIsOpen(true)
                break
            case "duplicate":
                setDuplicateSongDialogIsOpen(true)
                break
            case "editBars":
                props.setBarEditMode()
                break
            default:
                break
        }
    }

    const handleDuplicateSong = async (title: string) => {
        const { error, result } = await duplicateSong.run({
            title,
        })

        if (!error && result) {
            setDuplicateSongDialogIsOpen(false)
            history.push(`/song/${result.data.songId.toString()}`)
        }
    }

    return (
        <>
            <div>
                <IconButton
                    style={{ backgroundColor: colors.gray_200 }}
                    aria-haspopup="true"
                    aria-controls="songMenu"
                    onClick={handleClick}
                    aria-label={t("MenuButton.song")}
                >
                    <MoreHorizIcon />
                </IconButton>
                <Menu
                    id="songMenu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={() => handleClose()}
                    role="menu"
                >
                    <MenuItem onClick={() => handleClose("duplicate")}>
                        {t("MenuButton.duplicate")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("transpose")}>
                        {t("MenuButton.transpose")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("export")}>
                        {t("MenuButton.export")}
                    </MenuItem>
                    <MenuItem disabled onClick={() => handleClose()}>
                        {t("MenuButton.hide")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("delete")}>
                        {t("MenuButton.delete")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("editBars")}>
                        {props.barEditMode
                            ? t("MenuButton.cancelEditBars")
                            : t("MenuButton.editBars")}
                    </MenuItem>
                    {props.showName ? (
                        <>
                            <Divider variant="middle" />
                            <MenuItem disabled>
                                <Typography>{props.user}</Typography>
                            </MenuItem>
                            <MenuItem onClick={props.onLogout}>
                                <Typography>{t("LoginView.logout")}</Typography>
                            </MenuItem>
                        </>
                    ) : undefined}
                </Menu>
                <Dialog
                    open={deleteSongDialogIsOpen}
                    onClose={() => handleClose()}
                    aria-label={t("Dialog.deleteSong")}
                >
                    <ChoiceDialog
                        handleOnCancelClick={handleClose}
                        handleOnSaveClick={handleDeleteSong}
                        ackText={t("Dialog.deleteSong")}
                        cancelText={t("Dialog.cancel")}
                        headerText={t("Dialog.deleteSong")}
                        descriptionText={t("Dialog.deleteDescription")}
                    />
                </Dialog>
                <Dialog
                    open={transposeSongDialogIsOpen}
                    onClose={() => handleClose()}
                    aria-label={t("Dialog.transposed")}
                >
                    <TransposeDialog
                        defaultValue={`${songTitle} (${t(
                            "Dialog.transposed"
                        )})`}
                        handleOnCancelClick={handleClose}
                        handleOnSaveClick={handleTransposeSong}
                    />
                </Dialog>
                <Dialog
                    open={duplicateSongDialogIsOpen}
                    onClose={() => setDuplicateSongDialogIsOpen(false)}
                    aria-labelledby={t("DashboardView.duplicateText")}
                >
                    <InputDialog
                        handleOnCancelClick={() =>
                            setDuplicateSongDialogIsOpen(false)
                        }
                        handleOnSaveClick={handleDuplicateSong}
                        defaultValue={`${songTitle} (2)`}
                        saveText={t("Dialog.create")}
                        cancelText={t("Dialog.cancel")}
                        headerText={t("DashboardView.duplicateText")}
                        labelText={t("Dialog.newVoiceName")}
                        isLoading={duplicateSong.loading}
                    />
                </Dialog>
            </div>
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Dialog.deleteSongLoading")}
            />
            <Loading
                isLoading={transposeSong.loading}
                fullScreen
                text={t("Dialog.transposingSong")}
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Dialog.deleteSongError")}
            />
            <ErrorDialog
                isError={transposeSong.isError}
                error={transposeSong.error}
                title={t("Dialog.transposeSongError")}
            />
        </>
    )
}
