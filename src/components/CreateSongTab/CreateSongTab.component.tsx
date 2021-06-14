import React, { useState } from "react"
import {
    Box,
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
    const [newInstrumentModalIsOpen, setNewInstrumentModalIsOpen] =
        useState(false)
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

    const handleAddInstrument = async (title: string) => {
        const voiceNumber = Math.max(
            ...voices.map((voice) => voice.partNumber),
            0
        )
        const { error, result } = await postVoice.run({
            instrument: title,
            voiceNumber: voiceNumber + 1,
        })

        if (!error && result) {
            onAddVoice(result.data)
            setNewInstrumentModalIsOpen(false)
        }
    }

    const handleDeleteInstrument = async () => {
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
        setNewInstrumentModalIsOpen(false)
        setRenameModalIsOpen(false)
        setDeleteModalIsOpen(false)
    }

    const handleChangeVoiceTitle = async (voiceTitle: string) => {
        const { error, result } = await putVoice.run({
            instrument: voiceTitle,
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

    const handleDuplicateInstrument = async () => {
        const { error, result } = await duplicateVoice.run()

        if (!error && result) {
            onAddVoice(result.data)
        }
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
                            : voice.title
                        return (
                            <Tab
                                key={voice.songVoiceId}
                                value={voice.songVoiceId}
                                label={label}
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
                    aria-label="tab options"
                    onClick={handleMenuClick}
                >
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Menu
                id="menuBar"
                anchorEl={anchorEl}
                keepMounted
                open={!!anchorEl}
                onClose={() => handleClose()}
                role="menu"
            >
                <MenuItem
                    onClick={() => {
                        setNewInstrumentModalIsOpen(true)
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.newInstrument")}
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
                <MenuItem
                    disabled={selectedVoice?.isMain}
                    onClick={() => {
                        handleDuplicateInstrument()
                        setAnchorEl(null)
                    }}
                >
                    {t("CreateSongTab.duplicateVoice")}
                </MenuItem>
            </Menu>

            <InputModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={handleAddInstrument}
                handleClosed={() => handleClose()}
                modalOpen={newInstrumentModalIsOpen}
                saveText={t("Modal.create")}
                cancelText={t("Modal.cancel")}
                headerText={t("Modal.addInstrument")}
                labelText={t("Modal.nameOfInstrument")}
                characterLimit={100}
                isLoading={postVoice.loading}
            />
            <InputModal
                defaultValue={clickedVoice?.title || ""}
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
                handleOnSaveClick={handleDeleteInstrument}
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
                <MenuItem
                    onClick={() => {
                        handleDuplicateInstrument()
                        setRightClickMenuPosition(undefined)
                    }}
                >
                    {t("CreateSongTab.duplicateVoice")}
                </MenuItem>
            </Menu>
        </>
    )
}
