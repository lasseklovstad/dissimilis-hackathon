import React, { useState } from "react"
import { IconButton, Menu, Dialog, MenuItem } from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import {
    useDeleteSong,
    useDuplicateSong,
    useUpdateSong,
} from "../../utils/useApiServiceSongs"
import { EditSongInfoDialog } from "../CustomDialog/EditSongInfoDialog.component"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { InputDialog } from "../CustomDialog/InputDialog.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { ShareSongDialog } from "../CustomDialog/ShareSongDialog.component"
import { ShowSongInfoDialog } from "../CustomDialog/ShowSongInfoDialog.component"

export const SongGridMenuButton = (props: {
    songId: number
    link: string
    removeSong: (songId: number) => void
    renameSong: (songId: number, title: string) => void
    currentUserHasWriteAccess?: boolean
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [duplicateSongDialogIsOpen, setDuplicateSongDialogIsOpen] =
        useState(false)
    const [songInfoDialogIsOpen, setSongInfoDialogIsOpen] = useState(false)
    const [readSongInfoDialogIsOpen, setReadSongInfoDialogIsOpen] =
        useState(false)
    const [deleteSongDialogIsOpen, setDeleteSongDialogIsOpen] = useState(false)
    const [shareSongDialogIsOpen, setShareSongDialogIsOpen] = useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId } = props
    const { deleteSong } = useDeleteSong(songId.toString())
    const { duplicateSong } = useDuplicateSong(songId)
    const { putSong } = useUpdateSong(songId.toString())

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleOpenDeleteSongDialog = () => {
        setDeleteSongDialogIsOpen(true)
    }

    const handleDeleteSong = async () => {
        setDeleteSongDialogIsOpen(false)
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
            setDuplicateSongDialogIsOpen(false)
            history.push(`song/${result.data.songId.toString()}`)
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
            props.renameSong(songId, title)
        }
    }

    const handleOpenDuplicateDialog = () => {
        setDuplicateSongDialogIsOpen(true)
    }

    const handleCloseDuplicateDialog = () => {
        setDuplicateSongDialogIsOpen(false)
    }

    const handleOpenSongInfoDialog = () => {
        setSongInfoDialogIsOpen(true)
    }

    const handleCloseSongInfoDialog = () => {
        setSongInfoDialogIsOpen(false)
    }

    const handleClose = async (
        method?: "delete" | "info" | "copy" | "open" | "share" | "infoShow"
    ) => {
        setAnchorEl(null)
        setDeleteSongDialogIsOpen(false)
        switch (method) {
            case "delete":
                handleOpenDeleteSongDialog()
                break
            case "info":
                handleOpenSongInfoDialog()
                break
            case "copy":
                handleOpenDuplicateDialog()
                break
            case "open":
                handleOpenSong()
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

                    {props.currentUserHasWriteAccess
                        ? [
                              <>
                                  <MenuItem
                                      onClick={() => handleClose("delete")}
                                      key={"delete"}
                                  >
                                      {t("DashboardView.delete")}
                                  </MenuItem>
                                  <MenuItem
                                      onClick={() => handleClose("info")}
                                      key={"info"}
                                  >
                                      {t("Dialog.details")}
                                  </MenuItem>
                                  <MenuItem
                                      onClick={() => handleClose("share")}
                                      key={"share"}
                                  >
                                      {t("Dialog.share")}
                                  </MenuItem>
                              </>,
                          ]
                        : [
                              <MenuItem
                                  onClick={() => handleClose("infoShow")}
                                  key={"infoShow"}
                              >
                                  {t("Dialog.details")}
                              </MenuItem>,
                          ]}
                </Menu>
                <Dialog
                    open={deleteSongDialogIsOpen}
                    onClose={() => handleClose()}
                    aria-label={t("Dialog.deleteSong")}
                >
                    <ChoiceDialog
                        handleOnCancelClick={() => handleClose()}
                        handleOnSaveClick={handleDeleteSong}
                        ackText={t("Dialog.deleteSong")}
                        cancelText={t("Dialog.cancel")}
                        headerText={t("Dialog.deleteSong")}
                        descriptionText={t("Dialog.deleteDescription")}
                    />
                </Dialog>
            </div>
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
            <Dialog
                open={duplicateSongDialogIsOpen}
                onClose={handleCloseDuplicateDialog}
                aria-label={t("DashboardView.duplicateText")}
                maxWidth="sm"
                fullWidth
            >
                <InputDialog
                    handleOnCancelClick={handleCloseDuplicateDialog}
                    handleOnSaveClick={handleDuplicateSong}
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
                    handleOnCloseClick={() => setShareSongDialogIsOpen(false)}
                    songId={songId}
                />
            </Dialog>
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Dialog.deleteSongLoading")}
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Dialog.deleteSongError")}
            />
            <ErrorDialog
                isError={putSong.isError}
                error={putSong.error}
                title={t("Dialog.saveSongMetadataError")}
            />
        </>
    )
}
