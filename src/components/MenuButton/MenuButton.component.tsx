import React, { useState } from "react"
import { IconButton, Menu, MenuItem } from "@material-ui/core"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { colors } from "../../utils/colors"
import {
    useDeleteSong,
    useGetSong,
    useTransposeSong,
} from "../../utils/useApiServiceSongs"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { Loading } from "../loading/Loading.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { TransposeModal } from "../CustomModal/TransposeModal.component"

export const MenuButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [deleteSongModalIsOpen, setDeleteSongModalIsOpen] = useState(false)
    const { t } = useTranslation()
    const history = useHistory()
    const { songId, title, transpose } = useParams<{
        songId: string
        title: string
        transpose: string
    }>()
    const { deleteSong } = useDeleteSong(songId)
    const { getSong, songInit } = useGetSong(songId)
    const [transposeSongModalIsOpen, setTransposeSongModalIsOpen] = useState(
        false
    )
    const { transposeSong, songTransposedInit } = useTransposeSong(
        songId,
        title,
        transpose
    )

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
        history.push(`/song/${songId}/export`)
    }

    const handleOpenTransposeSongModal = async () => {
        if (songInit !== undefined) {
            setTransposeSongModalIsOpen(true)
        }
    }

    const handleTransposeSong = async (title: string, transpose: string) => {
        const { isError } = await transposeSong.run({ transpose })
        if (!isError) {
            history.push(`/song/${songTransposedInit?.songId}`)
        }
    }

    const handleClose = async (method?: "transpose" | "export" | "delete") => {
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
                    style={{ backgroundColor: colors.gray_200 }}
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
                    <MenuItem onClick={() => handleClose("transpose")}>
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
                <TransposeModal
                    defaultValue={`${songInit?.title} 2` ?? "No song found"}
                    modalOpen={transposeSongModalIsOpen}
                    handleClosed={() => handleClose()}
                    handleOnCancelClick={() => handleClose()}
                    handleOnSaveClick={(title: string, transpose: string) =>
                        handleTransposeSong(title, transpose)
                    }
                    headerText={t("Modal:transposeSong")}
                    labelText={t("Modal:nameOfSong")}
                />
            </div>
            <Loading
                isLoading={deleteSong.loading}
                fullScreen
                text={t("Modal:deleteSongLoading")}
            />
            <Loading
                isLoading={transposeSong.loading}
                fullScreen
                text="Transponerer sang"
            />
            <ErrorDialog
                isError={deleteSong.isError}
                error={deleteSong.error}
                title={t("Modal:deleteSongError")}
            />
        </>
    )
}
