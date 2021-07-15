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
import { InputDialog } from "../CustomDialog/InputDialog.component"
import {
    useCreateVoice,
    useDeleteVoice,
    useDuplicateVoice,
    useUpdateVoice,
} from "../../utils/useApiServiceSongs"
import { colors } from "../../utils/colors"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { NewVoiceDialog } from "../CustomDialog/NewVoiceDialog.component"
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
    const [newVoiceDialogIsOpen, setNewVoiceDialogIsOpen] = useState(false)
    const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
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
            case "Dialog.duplicateFullSong": {
                handleDuplicateVoice(title)
                break
            }
            case "Dialog.duplicateEmptySong": {
                const { error, result } = await postVoice.run({
                    voiceName: title,
                    voiceNumber: voiceNumber + 1,
                })
                if (!error && result) {
                    setNewVoiceDialogIsOpen(false)
                    onAddVoice(result.data)
                }
                break
            }
            case "Dialog.duplicateCustomSong": {
                setNewVoiceDialogIsOpen(false)
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
            setNewVoiceDialogIsOpen(false)
        }
    }

    const handleDeleteVoice = async () => {
        const { error } = await deleteVoice.run()

        if (!error && clickedVoice) {
            onDeleteVoice(clickedVoice)
            setDeleteDialogIsOpen(false)
        }
    }

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setClickedId(selectedVoiceId)
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setNewVoiceDialogIsOpen(false)
        setRenameDialogIsOpen(false)
        setDeleteDialogIsOpen(false)
    }

    const handleChangeVoiceName = async (voiceName: string) => {
        const { error, result } = await putVoice.run({
            voiceName: voiceName,
            voiceNumber: clickedVoice?.partNumber,
        })

        if (!error && result) {
            onUpdateVoice(result.data)
            setRenameDialogIsOpen(false)
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
                        setNewVoiceDialogIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.newVoice")}
                </MenuItem>
                <MenuItem
                    disabled={selectedVoice?.isMain}
                    onClick={() => {
                        setRenameDialogIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.changeVoiceName")}
                </MenuItem>
                <MenuItem
                    disabled={selectedVoice?.isMain}
                    onClick={() => {
                        setDeleteDialogIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.deleteVoice")}
                </MenuItem>
            </Menu>

            <Dialog
                open={newVoiceDialogIsOpen}
                onClose={handleClose}
                aria-labelledby={t("Dialog.addVoice")}
            >
                <NewVoiceDialog
                    handleOnCancelClick={handleClose}
                    handleOnSaveClick={handleAddVoice}
                    characterLimit={100}
                    isLoading={postVoice.loading || duplicateVoice.loading}
                />
            </Dialog>

            <Dialog
                open={renameDialogIsOpen}
                onClose={handleClose}
                aria-labelledby={t("Dialog.changeVoiceName")}
                maxWidth="sm"
                fullWidth
            >
                <InputDialog
                    defaultValue={clickedVoice?.voiceName || ""}
                    handleOnCancelClick={handleClose}
                    handleOnSaveClick={handleChangeVoiceName}
                    saveText={t("Dialog.save")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.changeVoiceName")}
                    labelText={t("Dialog.newVoiceName")}
                    isLoading={putVoice.loading}
                    characterLimit={100}
                />
            </Dialog>
            <Dialog
                open={deleteDialogIsOpen}
                onClose={() => handleClose()}
                aria-label={t("Dialog.deleteVoice")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleClose}
                    handleOnSaveClick={handleDeleteVoice}
                    ackText={t("Dialog.deleteVoice")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("Dialog.deleteVoice")}
                    descriptionText={t("Dialog.deleteVoiceDescription")}
                    isLoading={deleteVoice.loading}
                />
            </Dialog>
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
                        setRenameDialogIsOpen(true)
                        setRightClickMenuPosition(undefined)
                    }}
                >
                    {t("CreateSongTab.changeVoiceName")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setDeleteDialogIsOpen(true)
                        setRightClickMenuPosition(undefined)
                    }}
                >
                    {t("CreateSongTab.deleteVoice")}
                </MenuItem>
            </Menu>
            <ErrorDialog
                isError={postVoice.isError}
                error={postVoice.error}
                title={t("Dialog.newVoiceError")}
            />
            <ErrorDialog
                isError={duplicateVoice.isError}
                error={duplicateVoice.error}
                title={t("Dialog.newVoiceError")}
            />
        </>
    )
}
