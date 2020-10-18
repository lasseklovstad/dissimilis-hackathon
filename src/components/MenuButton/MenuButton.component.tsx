import React, { useState } from "react"
import { IconButton, makeStyles, Menu, MenuItem } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useHistory, useRouteMatch } from "react-router-dom"
import { colors } from "../../utils/colors"
import { useDeleteSong } from "../../utils/useApiServiceSongs"
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
    const { t } = useTranslation()
    const history = useHistory()
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
        history.push(`/song/${id}/export`)
    }

    const handleClose = async (method?: "export" | "delete") => {
        setAnchorEl(null)
        setDeleteSongModalIsOpen(false)
        switch (method) {
            case "export":
                await exportSong()
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
                    handleClosed={() => handleClose()}
                    handleOnSaveClick={handleDeleteSong}
                    ackText={t("Modal:deleteSong")}
                    modalOpen={deleteSongModalIsOpen}
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
        </>
    )
}
