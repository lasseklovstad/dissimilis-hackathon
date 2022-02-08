import React, { useState } from "react"
import {
    Dialog,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { colors } from "../../utils/colors"
import {
    useDeleteSong,
    useDuplicateSong,
    useTransposeSong,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { EditSongInfoDialog } from "../CustomDialog/EditSongInfoDialog.component"
import { TransposeDialog } from "../CustomDialog/TransposeDialog.component"
import { InputDialog } from "../CustomDialog/InputDialog.component"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import { useVoice } from "../../utils/useVoice"
import { ShareSongDialog } from "../CustomDialog/ShareSongDialog.component"
import { ShowSongInfoDialog } from "../CustomDialog/ShowSongInfoDialog.component"
import { useUser } from "../UserContextProvider/UserContextProvider"

export const MenuButton = (props: {
    showName: boolean
    updateSongTitle: (title: string) => void
    songTitle: string
    currentUserHasWriteAccess?: boolean
    barEditMode: boolean
    setBarEditMode: (mode: boolean) => void
}) => {
    const {
        showName,
        updateSongTitle,
        songTitle,
        currentUserHasWriteAccess,
        barEditMode,
        setBarEditMode,
    } = props
    const { song, setSelectedBars, setBarsClipboard } = useSongContext()
    const selectedVoice = useVoice(song?.voices)
    const { songVoiceId: voiceId } = selectedVoice || {}
    const { user } = useUser()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteSongDialogIsOpen, setDeleteSongDialogIsOpen] = useState(false)
    const [duplicateSongDialogIsOpen, setDuplicateSongDialogIsOpen] =
        useState(false)
    const [songInfoDialogIsOpen, setSongInfoDialogIsOpen] = useState(false)
    const [readSongInfoDialogIsOpen, setReadSongInfoDialogIsOpen] =
        useState(false)
    const [shareSongDialogIsOpen, setShareSongDialogIsOpen] = useState(false)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        songId: songIdString,
        title,
        transpose,
    } = useParams<{
        songId: string
        title: string
        transpose: string
    }>()
    const songId = Number(songIdString)
    const { deleteSong } = useDeleteSong(songId)
    const [transposeSongDialogIsOpen, setTransposeSongDialogIsOpen] =
        useState(false)
    const { transposeSong } = useTransposeSong(songId, title, transpose)
    const { duplicateSong } = useDuplicateSong(songId)
    const { putSong } = useUpdateSong(songId)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleDeleteSong = async () => {
        setDeleteSongDialogIsOpen(false)
        const { isError } = await deleteSong.run()
        if (!isError) {
            navigate("/dashboard")
        }
    }

    const exportSong = async () => {
        navigate(`/song/${songId}/export?voice=${voiceId}`)
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
            navigate(`/song/${result?.data?.songId}`)
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
            | "share"
            | "infoShow"
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
                setBarEditMode(!barEditMode)
                setSelectedBars(undefined)
                setBarsClipboard(undefined)
                break
            case "info":
                handleOpenSongInfoDialog()
                break
            case "share":
                setShareSongDialogIsOpen(true)
                break
            case "infoShow":
                setReadSongInfoDialogIsOpen(true)
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
            navigate(`/song/${result.data.songId.toString()}`)
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
            updateSongTitle(title)
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
                    size="large"
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

                    {currentUserHasWriteAccess
                        ? [
                              <MenuItem
                                  onClick={() => handleClose("delete")}
                                  key="delete"
                              >
                                  {t("MenuButton.delete")}
                              </MenuItem>,
                              <MenuItem
                                  onClick={() => handleClose("editBars")}
                                  key="editBars"
                              >
                                  {barEditMode
                                      ? t("MenuButton.cancelEditBars")
                                      : t("MenuButton.editBars")}
                              </MenuItem>,
                              <MenuItem
                                  onClick={() => handleClose("info")}
                                  key="details"
                              >
                                  {t("Dialog.details")}
                              </MenuItem>,
                              <MenuItem
                                  onClick={() => handleClose("share")}
                                  key="share"
                              >
                                  {t("Dialog.share")}
                              </MenuItem>,
                          ]
                        : [
                              <MenuItem
                                  onClick={() => handleClose("infoShow")}
                                  key="infoShow"
                              >
                                  {t("Dialog.details")}
                              </MenuItem>,
                          ]}
                    {showName ? (
                        <>
                            <Divider variant="middle" />
                            <MenuItem disabled>
                                <Typography>{user.email}</Typography>
                            </MenuItem>
                        </>
                    ) : undefined}
                </Menu>
                <Dialog
                    open={songInfoDialogIsOpen}
                    onClose={() => handleCloseSongInfoDialog()}
                >
                    <EditSongInfoDialog
                        songId={songId}
                        handleOnCancelClick={() => handleCloseSongInfoDialog()}
                        handleOnSaveClick={handleSaveSongInfo}
                        isLoadingPatch={putSong.loading}
                    />
                </Dialog>
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
                    maxWidth="sm"
                    fullWidth
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
                <Dialog
                    open={shareSongDialogIsOpen}
                    onClose={() => setShareSongDialogIsOpen(false)}
                    aria-label={"Dialog.ShareSong"}
                    maxWidth="xs"
                    fullWidth
                >
                    <ShareSongDialog
                        handleOnCloseClick={() =>
                            setShareSongDialogIsOpen(false)
                        }
                        songId={songId}
                    />
                </Dialog>
                <Dialog
                    open={readSongInfoDialogIsOpen}
                    onClose={() => setReadSongInfoDialogIsOpen(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <ShowSongInfoDialog
                        songId={songId}
                        handleOnCancelClick={() =>
                            setReadSongInfoDialogIsOpen(false)
                        }
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
            <ErrorDialog
                isError={putSong.isError}
                error={putSong.error}
                title={t("Dialog.saveSongMetadataError")}
            />
        </>
    )
}
