import React, { useState } from "react"
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    IconButton,
    Menu,
    MenuItem,
    Tab,
    Tabs,
} from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { IVoice } from "../../models/IVoice"
import {
    useCreateVoice,
    useDeleteVoice,
    useDuplicateVoice,
    useUpdateVoice,
} from "../../utils/useApiServiceSongs"
import { colors } from "../../utils/colors"
import { ErrorDialog } from "../errorDialog/ErrorDialog.component"
import { useSongDispatchContext } from "../../context/song/SongContextProvider.component"
import { useVoice } from "../../utils/useVoice"
import { CustomVoiceDialog } from "../CustomDialog/CustomVoiceModeDialog.component"
import { Undo as UndoIcon, MoreVert as MoreVertIcon } from "@mui/icons-material"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { InputDialog } from "../CustomDialog/InputDialog.component"
import { NewVoiceDialog } from "../CustomDialog/NewVoiceDialog.component"
import { useHotkeys } from "react-hotkeys-hook"
import { ISong } from "../../models/ISong"

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
})

export const CreateSongTab = (props: {
    updateSong: () => void
    onUndo: () => void
    undoIsLoading?: boolean
    currentUserHasWriteAccess?: boolean
    song: ISong
}) => {
    const { dispatchSong } = useSongDispatchContext()
    const {
        currentUserHasWriteAccess,
        onUndo,
        undoIsLoading,
        song,
        updateSong,
    } = props
    const selectedVoice = useVoice(song?.voices)
    const { songVoiceId: selectedVoiceId } = selectedVoice || {}
    const { songId, voices } = song!!

    const [newVoiceDialogIsOpen, setNewVoiceDialogIsOpen] = useState(false)
    const [renameDialogIsOpen, setRenameDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [customVoiceDialogIsOpen, setCustomVoiceDialogIsOpen] =
        useState(false)
    const { t } = useTranslation()
    const [clickedId, setClickedId] = useState<undefined | number>()
    const clickedVoice = useVoice(song?.voices)

    const [rightClickMenuPosition, setRightClickMenuPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const { postVoice } = useCreateVoice(songId)
    const { putVoice } = useUpdateVoice(songId, clickedId)
    const { deleteVoice } = useDeleteVoice(songId, clickedId)
    const { duplicateVoice } = useDuplicateVoice(songId, clickedId)
    const classes = useStyles()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const onAddVoice = (voice: IVoice) => {
        dispatchSong({ type: "ADD_VOICE", voice })
        navigate(`?voice=${voice.songVoiceId}`)
    }

    const onDeleteVoice = (voice: IVoice) => {
        dispatchSong({ type: "DELETE_VOICE", songVoiceId: voice.songVoiceId })

        if (voice.songVoiceId === selectedVoiceId) {
            navigate(`/song/${songId}`)
        }
    }

    useHotkeys("ctrl+z", () => {
        onUndo()
    })

    const onUpdateVoice = (voice: IVoice) => {
        dispatchSong({ type: "UPDATE_VOICE_NAME", voice })
    }

    const handleAddVoice = async (title: string, option: string) => {
        const voiceNumber = Math.max(
            ...voices.map((voice) => voice.voiceNumber),
            0
        )
        switch (option) {
            case "Dialog.duplicateFullVoice": {
                handleDuplicateVoice(title)
                break
            }
            case "Dialog.duplicateEmptyVoice": {
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
            case "Dialog.duplicateCustomVoice": {
                const { error, result } = await postVoice.run({
                    voiceName: title,
                    voiceNumber: voiceNumber + 1,
                })
                if (!error && result) {
                    setNewVoiceDialogIsOpen(false)
                    setCustomVoiceDialogIsOpen(true)
                    onAddVoice(result.data)
                    setClickedId(result.data.songVoiceId)
                }
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
            voiceNumber: clickedVoice?.voiceNumber,
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

    const handleCustomVoiceDialogCancel = async () => {
        handleDeleteVoice()
        setCustomVoiceDialogIsOpen(false)
    }

    const handleCustomVoiceDialogSave = () => {
        setCustomVoiceDialogIsOpen(false)
        updateSong()
    }

    return (
        <>
            <Box display="flex" flexWrap="wrap" alignItems="center">
                <Tabs
                    value={selectedVoiceId}
                    variant="scrollable"
                    textColor={"inherit"}
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
                                    navigate(`?voice=${voice.songVoiceId}`)
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

                {currentUserHasWriteAccess && (
                    <>
                        <IconButton
                            aria-haspopup="true"
                            aria-controls="voiceTabMenu"
                            aria-label={t("CreateSongTab.menu")}
                            onClick={handleMenuClick}
                            disableFocusRipple
                            size="large"
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Box ml="auto">
                            {undoIsLoading ? (
                                <Button
                                    startIcon={
                                        <CircularProgress
                                            aria-label="Loading"
                                            size={22}
                                        />
                                    }
                                    className={classes.buttonsstyle}
                                    onClick={onUndo}
                                    disabled
                                >
                                    {t("Song.undo")}
                                </Button>
                            ) : (
                                <Button
                                    startIcon={<UndoIcon />}
                                    className={classes.buttonsstyle}
                                    onClick={onUndo}
                                >
                                    {t("Song.undo")}
                                </Button>
                            )}
                        </Box>
                    </>
                )}
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
            <Dialog
                fullScreen
                open={customVoiceDialogIsOpen}
                onClose={handleCustomVoiceDialogCancel}
                aria-labelledby={t("Modal.CustomNewVoice")}
            >
                {selectedVoice && (
                    <CustomVoiceDialog
                        handleOnSave={handleCustomVoiceDialogSave}
                        handleOnCancel={handleCustomVoiceDialogCancel}
                        baseVoice={voices[0]}
                        newVoice={selectedVoice}
                    />
                )}
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
