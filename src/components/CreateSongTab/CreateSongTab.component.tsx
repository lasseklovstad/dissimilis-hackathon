import React, { useEffect, useState } from "react"
import {
    Box,
    Button,
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
import { Add } from "@material-ui/icons"
import { IVoice } from "../../models/IVoice"
import { InputModal } from "../CustomModal/InputModal.component"
import {
    useCreateVoice,
    useDeleteVoice,
    useUpdateVoice,
} from "../../utils/useApiServiceSongs"
import { colors } from "../../utils/colors"

const useStyles = makeStyles({
    root: {
        minWidth: 50,
        margin: 4,
        padding: "8px 16px",
        border: `1px solid ${colors.gray_200}`,
        borderRadius: 4,
        opacity: 1,
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
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
    const { t } = useTranslation()
    // const [rightClicked, setRightClicked] = useState<undefined | number>()
    // const rightClickedVoice = voices.find(
    //     (voice) => voice.songVoiceId === rightClicked
    // )
    const selectedVoice = voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )
    const [position, setPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const { postVoice } = useCreateVoice(songId)
    const { putVoice } = useUpdateVoice(songId, selectedVoiceId)
    const { deleteVoice } = useDeleteVoice(songId, selectedVoiceId)
    const classes = useStyles()
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleAddInstrument = async (title: string) => {
        const { error, result } = await postVoice.run({
            instrument: title,
            voiceNumber: voices.length + 1,
        })

        if (!error && result) {
            onAddVoice(result.data)
            setModalIsOpen(false)
            setAnchorEl(null)
        }
    }

    const handleDeleteInstrument = async () => {
        const { error } = await deleteVoice.run()

        if (!error && selectedVoice) {
            onDeleteVoice(selectedVoice)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseVoiceMenu = (method?: "add" | "delete" | "updateTitle") => {
        switch (method) {
            case "add":
                setModalIsOpen(true)
                break
            case "delete":
                handleDeleteInstrument()
                break
            case "updateTitle":
                setRenameModalIsOpen(true)
                break
            default:
                break
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
        setModalIsOpen(false)
        setRenameModalIsOpen(false)
    }

    // const handleCloseMenu = async (method: "deleteVoice" | "renameVoice") => {
    //     if (method === "renameVoice") {
    //         setRenameModalIsOpen(true)
    //     }
    //     if (method === "deleteVoice") {
    //         const { error } = await deleteVoice.run()

    //         if (!error && selectedVoice) {
    //             onDeleteVoice(selectedVoice)
    //         }
    //     }
    //     setPosition(undefined)
    // }

    const handleChangeVoiceTitle = async (voiceTitle: string) => {
        const { error, result } = await putVoice.run({
            instrument: voiceTitle,
            voiceNumber: selectedVoice?.partNumber,
        })

        if (!error && result) {
            onUpdateVoice(result.data)
            setRenameModalIsOpen(false)
        }
    }

    // const handleRightClick = (voiceId: number) => (event: React.MouseEvent) => {
    //     event.preventDefault()
    //     setPosition({ top: event.clientY - 4, left: event.clientX - 2 })
    //     setRightClicked(voiceId)
    // }

    return (
        <>
            <Box display="flex" flexWrap="wrap">
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
                            ? t("CreateSongTab:song")
                            : voice.title
                        return (
                            <Tab
                                key={voice.songVoiceId}
                                value={voice.songVoiceId}
                                label={label}
                                onClick={() =>
                                    history.push(`?voice=${voice.songVoiceId}`)
                                }
                                // onContextMenu={
                                //     !voice.isMain
                                //         ? handleRightClick(voice.songVoiceId)
                                //         : undefined
                                // }
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
                    onClick={handleClick}
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
                <MenuItem onClick={() => handleCloseVoiceMenu("add")}>
                    {t("CreateSongTab:newInstrument")}
                </MenuItem>
                <MenuItem disabled={selectedVoice?.isMain} onClick={() => handleCloseVoiceMenu("updateTitle")}>
                    {t("CreateSongTab:changeVoiceName")}
                </MenuItem>
                <MenuItem disabled={selectedVoice?.isMain} onClick={() => handleCloseVoiceMenu("delete")}>
                    {t("CreateSongTab:deleteVoice")}
                </MenuItem>
            </Menu>

            <InputModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={handleAddInstrument}
                handleClosed={() => handleClose()}
                modalOpen={modalIsOpen}
                saveText={t("Modal:create")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:addInstrument")}
                labelText={t("Modal:nameOfInstrument")}
                characterLimit={100}
            />
            <InputModal
                defaultValue={selectedVoice?.title || ""}
                handleOnCancelClick={handleClose}
                handleOnSaveClick={handleChangeVoiceTitle}
                handleClosed={handleClose}
                modalOpen={renameModalIsOpen}
                saveText={t("Modal:save")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:changeVoiceName")}
                labelText={t("Modal:newVoiceName")}
            />
            {/* <Menu
                open={!!position}
                onClose={() => {
                    setPosition(undefined)
                }}
                anchorReference="anchorPosition"
                anchorPosition={position}
            >
                <MenuItem
                    onClick={() => {
                        handleCloseMenu("renameVoice")
                    }}
                >
                    {t("CreateSongTab:changeVoiceName")}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleCloseMenu("deleteVoice")
                    }}
                >
                    {t("CreateSongTab:deleteVoice")}
                </MenuItem>
            </Menu> */}
        </>
    )
}
