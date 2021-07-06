import React, { useState } from "react"
import {
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
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { TransposeModal } from "../CustomModal/TransposeModal.component"
import { InputModal } from "../CustomModal/InputModal.component"
import { EditSongInfoDialog } from "../CustomDialog/EditSongInfoDialog.component"
import { Dialog } from "@material-ui/core"

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
    const [deleteSongModalIsOpen, setDeleteSongModalIsOpen] = useState(false)
    const [duplicateSongModalIsOpen, setDuplicateSongModalIsOpen] =
        useState(false)
    const [songInfoDialogIsOpen, setSongInfoDialogIsOpen] = useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId, title, transpose } = useParams<{
        songId: string
        title: string
        transpose: string
    }>()
    const { deleteSong } = useDeleteSong(songId)
    const [transposeSongModalIsOpen, setTransposeSongModalIsOpen] =
        useState(false)
    const { transposeSong } = useTransposeSong(songId, title, transpose)
    const { duplicateSong } = useDuplicateSong(Number(songId))
    const { putSong } = useUpdateSong(songId.toString())

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDeleteSong = async () => {
        setDeleteSongModalIsOpen(false)
        const { isError } = await deleteSong.run()
        if (!isError) {
            history.replace("/dashboard")
        }
    }

    const exportSong = async () => {
        history.push(`/song/${songId}/export?voice=${props.voiceId}`)
    }

    const handleOpenTransposeSongModal = async () => {
        setTransposeSongModalIsOpen(true)
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

    const handleOpenSongInfoDialog = () => {
        setSongInfoDialogIsOpen(true)
    }

    const handleCloseSongInfoDialog = () => {
        setSongInfoDialogIsOpen(false)
    }

    const handleClose = async (
        method?:
            | "transpose"
            | "export"
            | "delete"
            | "duplicate"
            | "editBars"
            | "info"
    ) => {
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        setTransposeSongModalIsOpen(false)
        switch (method) {
            case "transpose":
                handleOpenTransposeSongModal()
                break
            case "export":
                await exportSong()
                break
            case "delete":
                setDeleteSongModalIsOpen(true)
                break
            case "duplicate":
                setDuplicateSongModalIsOpen(true)
                break
            case "editBars":
                props.setBarEditMode()
                break
            case "info":
                handleOpenSongInfoDialog()
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
            setDuplicateSongModalIsOpen(false)
            history.push(`/song/${result.data.songId.toString()}`)
        }
    }

    const handleSaveSongInfo = async (
        title: string,
        arrangerName: string,
        composer: string,
        songNotes: string,
        speed: number // tempo is called speed in backend
    ) => {
        const { error, result } = await putSong.run({
            title,
            arrangerName,
            composer,
            songNotes,
            speed,
        })

        if (!error && result) {
            setSongInfoDialogIsOpen(false)
            // How to refresh?
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
                    <MenuItem onClick={() => handleClose("info")}>
                        {t("MenuButton.details")}
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
                <ChoiceModal
                    handleOnCancelClick={handleClose}
                    handleClosed={handleClose}
                    handleOnSaveClick={handleDeleteSong}
                    ackText={t("Modal.deleteSong")}
                    modalOpen={deleteSongModalIsOpen}
                    cancelText={t("Modal.cancel")}
                    headerText={t("Modal.deleteSong")}
                    descriptionText={t("Modal.deleteDescription")}
                />
                <TransposeModal
                    defaultValue={`${songTitle} (${t("Modal.transposed")})`}
                    modalOpen={transposeSongModalIsOpen}
                    handleClosed={handleClose}
                    handleOnCancelClick={handleClose}
                    handleOnSaveClick={handleTransposeSong}
                />
                <InputModal
                    handleOnCancelClick={() =>
                        setDuplicateSongModalIsOpen(false)
                    }
                    handleOnSaveClick={handleDuplicateSong}
                    handleClosed={() => setDuplicateSongModalIsOpen(false)}
                    modalOpen={duplicateSongModalIsOpen}
                    defaultValue={`${songTitle} (2)`}
                    saveText={t("Modal.create")}
                    cancelText={t("Modal.cancel")}
                    headerText={t("DashboardView.duplicateText")}
                    labelText={t("Modal.newVoiceName")}
                    isLoading={duplicateSong.loading}
                />
                <Dialog
                    open={songInfoDialogIsOpen}
                    onClose={() => handleCloseSongInfoDialog()}
                >
                    <EditSongInfoDialog
                        songId={parseInt(songId)}
                        handleOnCancelClick={() => handleCloseSongInfoDialog()}
                        handleOnSaveClick={handleSaveSongInfo}
                        handleClosed={() => handleCloseSongInfoDialog()}
                        dialogOpen={songInfoDialogIsOpen}
                        saveText={t("Modal.save")}
                        cancelText={t("Modal.cancel")}
                        headerText={t("MenuButton.details")}
                        songNameLabelText={t("Modal.nameOfSong")}
                        arrangerLabelText={t("Song.arranger")}
                        composerLabelText={t("Song.composer")}
                        songNotesLabelText={t("Song.songNotes")}
                        speedLabelText={t("Song.songSpeed")}
                        isLoadingPatch={putSong.loading}
                    />
                </Dialog>
            </div>
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Modal.deleteSongLoading")}
            />
            <Loading
                isLoading={transposeSong.loading}
                fullScreen
                text={t("Modal.transposingSong")}
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Modal.deleteSongError")}
            />
            <ErrorDialog
                isError={transposeSong.isError}
                error={transposeSong.error}
                title={t("Modal.transposeSongError")}
            />
        </>
    )
}
