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
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"

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

    const handleDeleteSong = async () => {
        setDeleteSongModalIsOpen(false)
        const { isError } = await deleteSong.run()
        if (!isError) {
            history.replace("/dashboard")
        }
    }

    const exportSong = async () => {
        setShowPossiblePositions(false)
        const { isError } = await putSong.run()
        if (!isError) {
            history.push(`/song/${id}/export`)
        }
    }

    const saveSong = async () => {
        const { result } = await putSong.run()
        if (result && result.status >= 200 && result.status <= 299) {
            setIsSaving(true)
        } else {
            setIsSaving(false)
        }
    }

    const handleClose = async (method?: "export" | "save" | "delete") => {
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        switch (method) {
            case "export":
                await exportSong()
                break
            case "save":
                await saveSong()
                break
            case "delete":
                handleOpenDeleteSongModal()
                break
            default:
                break
        }
    }

    return (
        <>
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
                    open={!!anchorEl}
                    onClose={() => handleClose()}
                    role="menu"
                >
                    <MenuItem onClick={() => handleClose("save")}>
                        {t("MenuButton:save")}
                    </MenuItem>
                    <MenuItem disabled onClick={() => handleClose()}>
                        {t("MenuButton:duplicate")}
                    </MenuItem>
                    <MenuItem disabled onClick={() => handleClose()}>
                        {t("MenuButton:transpose")}
                    </MenuItem>
                    <MenuItem onClick={() => handleClose("export")}>
                        {t("MenuButton:export")}
                    </MenuItem>
                    <MenuItem disabled onClick={() => handleClose()}>
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
            <ErrorDialog
                isError={putSong.isError}
                error={putSong.error}
                title={t("Modal:saveSongError")}
            />
        </>
    )
}
