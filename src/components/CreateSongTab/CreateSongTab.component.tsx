import React, { useState } from "react"
import {
    Box,
    Button,
    Dialog,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Tab,
    Tabs,
} from "@material-ui/core"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { IVoice } from "../../models/IVoice"
import { InputModal } from "../CustomModal/InputModal.component"
import {
    useCreateVoice,
    useDeleteVoice,
    useDuplicateVoice,
    useUpdateVoice,
} from "../../utils/useApiServiceSongs"
import { colors } from "../../utils/colors"
import { ChoiceModal } from "../CustomModal/ChoiceModal.component"
import { NewVoiceDialog } from "../CustomModal/NewVoiceDialog.component"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import UndoIcon from "@material-ui/icons/Undo"

const useStyles = makeStyles({
    root: {
        minWidth: 50,
        margin: 4,
        padding: "8px 16px",
        border: `1px solid ${colors.gray_200}`,
        borderRadius: 4,
        opacity: 1,
        height: "56px",
        fontWeight: 400,
        fontSize: "1rem",
        lineHeight: 1.5,
        "&:hover": {
            backgroundColor: colors.gray_200,
        },
    },
    selected: {
        backgroundColor: colors.gray_200,
    },
    buttonsstyle: {
        border: `1px solid ${colors.gray_200}`,
        padding: "8px 16px",
        margin: 4,
        "&:hover": {
            backgroundColor: colors.gray_200,
        },
        "&:focus": {
            backgroundColor: colors.gray_200,
        },
    },
    undoButtonContainer: {
        marginLeft: "auto",
    },
    undoButtonText: {
        marginLeft: "8px",
    },
})

export const CreateSongTab = (props: {
    voices: IVoice[]
    selectedVoiceId: number
    songId: string
    onAddVoice: (voice: IVoice) => void
    onUpdateVoice: (voice: IVoice) => void
    onDeleteVoice: (voice: IVoice) => void
}) => {
    const {
        voices,
        selectedVoiceId,
        songId,
        onAddVoice,
        onUpdateVoice,
        onDeleteVoice,
    } = props
    const [newVoiceModalIsOpen, setNewVoiceModalIsOpen] = useState(false)
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
    const { t } = useTranslation()
    const [clickedId, setClickedId] = useState<undefined | number>()
    const clickedVoice = voices.find((voice) => voice.songVoiceId === clickedId)
    const selectedVoice = voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )
    const [rightClickMenuPosition, setRightClickMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const { postVoice } = useCreateVoice(songId)
    const { putVoice } = useUpdateVoice(songId, clickedId)
    const { deleteVoice } = useDeleteVoice(songId, clickedId)
    const { duplicateVoice } = useDuplicateVoice(songId, clickedId)
    const classes = useStyles()
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleAddVoice = async (title: string, option: string) => {
        const voiceNumber = Math.max(
            ...voices.map((voice) => voice.partNumber),
            0
        )
        switch (option) {
            case "Modal.duplicateFullSong": {
                handleDuplicateVoice(title)
                break
            }
            case "Modal.duplicateEmptySong": {
                const { error, result } = await postVoice.run({
                    voiceName: title,
                    voiceNumber: voiceNumber + 1,
                })
                if (!error && result) {
                    setNewVoiceModalIsOpen(false)
                    onAddVoice(result.data)
                }
                break
            }
            case "Modal.duplicateCustomSong": {
                setNewVoiceModalIsOpen(false)
                break
            }
        }
    }

    const handleDuplicateVoice = async (voiceName: string) => {
        const { error, result } = await duplicateVoice.run({
            voiceName,
        })

        if (!error && result) {
            onAddVoice(result.data)
            setNewVoiceModalIsOpen(false)
        }
    }

    const handleDeleteVoice = async () => {
        const { error } = await deleteVoice.run()

        if (!error && clickedVoice) {
            onDeleteVoice(clickedVoice)
            setDeleteModalIsOpen(false)
        }
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedId(selectedVoiceId)
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setNewVoiceModalIsOpen(false)
        setRenameModalIsOpen(false)
        setDeleteModalIsOpen(false)
    }

    const handleChangeVoiceTitle = async (voiceTitle: string) => {
        const { error, result } = await putVoice.run({
            voiceTitle: voiceTitle,
            voiceNumber: clickedVoice?.partNumber,
        })

        if (!error && result) {
            onUpdateVoice(result.data)
            setRenameModalIsOpen(false)
        }
    }

    const handleRightClick = (voiceId: number) => (event: React.MouseEvent) => {
        event.preventDefault()
        setClickedId(voiceId)
        setRightClickMenuPosition({
            top: event.clientY - 4,
            left: event.clientX - 2,
        })
    }

    return (
        <>
            <Box display="flex" flexWrap="wrap" alignItems="center">
                <Tabs
                    value={selectedVoiceId}
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{
                        style: {
                            display: "none",
                        },
                    }}
                >
                    {voices.map((voice) => {
                        const label = voice.isMain
                            ? t("CreateSongTab.song")
                            : voice.voiceName
                        return (
                            <Tab
                                key={voice.songVoiceId}
                                value={voice.songVoiceId}
                                label={label}
                                disableFocusRipple
                                onClick={() =>
                                    history.push(`?voice=${voice.songVoiceId}`)
                                }
                                onContextMenu={
                                    !voice.isMain
                                        ? handleRightClick(voice.songVoiceId)
                                        : undefined
                                }
                                classes={{
                                    root: classes.root,
                                    selected: classes.selected,
                                }}
                            />
                        )
                    })}
                </Tabs>

                <IconButton
                    aria-haspopup="true"
                    aria-controls="voiceTabMenu"
                    aria-label={t("CreateSongTab.menu")}
                    onClick={handleMenuClick}
                    disableFocusRipple
                >
                    <MoreVertIcon />
                </IconButton>
                <div className={classes.undoButtonContainer}>
                    <Button className={classes.buttonsstyle}>
                        <UndoIcon />
                        <div className={classes.undoButtonText}>
                            {t("Song.undo")}
                        </div>
                    </Button>
                </div>
            </Box>

            <Menu
                id="voiceTabMenu"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={() => handleClose()}
                role="menu"
            >
                <MenuItem
                    onClick={() => {
                        setNewVoiceModalIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.newVoice")}
                </MenuItem>
                <MenuItem
                    disabled={selectedVoice?.isMain}
                    onClick={() => {
                        setRenameModalIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.changeVoiceName")}
                </MenuItem>
                <MenuItem
                    disabled={selectedVoice?.isMain}
                    onClick={() => {
                        setDeleteModalIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.deleteVoice")}
                </MenuItem>
            </Menu>

            <Dialog
                open={newVoiceModalIsOpen}
                onClose={() => handleClose()}
                aria-labelledby={t("Modal.addVoice")}
            >
                <NewVoiceDialog
                    handleOnCancelClick={() => handleClose()}
                    handleOnSaveClick={handleAddVoice}
                    characterLimit={100}
                    isLoading={postVoice.loading || duplicateVoice.loading}
                />
            </Dialog>
            <InputModal
                defaultValue={clickedVoice?.voiceName || ""}
                handleOnCancelClick={handleClose}
                handleOnSaveClick={handleChangeVoiceTitle}
                handleClosed={handleClose}
                modalOpen={renameModalIsOpen}
                saveText={t("Modal.save")}
                cancelText={t("Modal.cancel")}
                headerText={t("Modal.changeVoiceName")}
                labelText={t("Modal.newVoiceName")}
                isLoading={putVoice.loading}
                characterLimit={100}
            />
            <ChoiceModal
                handleOnCancelClick={handleClose}
                handleClosed={handleClose}
                handleOnSaveClick={handleDeleteVoice}
                ackText={t("Modal.deleteVoice")}
                modalOpen={deleteModalIsOpen}
                cancelText={t("Modal.cancel")}
                headerText={t("Modal.deleteVoice")}
                descriptionText={t("Modal.deleteVoiceDescription")}
            />
            <Menu
                open={!!rightClickMenuPosition}
                onClose={() => {
                    setRightClickMenuPosition(undefined)
                }}
                anchorReference="anchorPosition"
                anchorPosition={rightClickMenuPosition}
            >
                <MenuItem
                    onClick={() => {
                        setRenameModalIsOpen(true)
                        setRightClickMenuPosition(undefined)
                    }}
                >
                    {t("CreateSongTab.changeVoiceName")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDeleteModalIsOpen(true)
                        setRightClickMenuPosition(undefined)
                    }}
                >
                    {t("CreateSongTab.deleteVoice")}
                </MenuItem>
            </Menu>
            <ErrorDialog
                isError={postVoice.isError}
                error={postVoice.error}
                title={t("Modal.newVoiceError")}
            />
            <ErrorDialog
                isError={duplicateVoice.isError}
                error={duplicateVoice.error}
                title={t("Modal.newVoiceError")}
            />
        </>
    )
}
