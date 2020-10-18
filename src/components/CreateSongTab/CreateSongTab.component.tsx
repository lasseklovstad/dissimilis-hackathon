import React, { useState } from "react"
import { Box, Button, Menu, MenuItem, Tab, Tabs } from "@material-ui/core"
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

export const CreateSongTab = (props: {
    voices: IVoice[]
    selectedVoice: number
    songId: string
    onAddVoice: (voice: IVoice) => void
    onUpdateVoice: (voice: IVoice) => void
    onDeleteVoice: (voice: IVoice) => void
}) => {
    const {
        voices,
        selectedVoice,
        songId,
        onAddVoice,
        onUpdateVoice,
        onDeleteVoice,
    } = props
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
    const { t } = useTranslation()
    const [rightClicked, setRightClicked] = useState<undefined | number>()
    const [position, setPosition] = useState<
        { top: number; left: number } | undefined
    >()
    const { postVoice } = useCreateVoice(songId)
    const { putVoice } = useUpdateVoice(songId, rightClicked)
    const { deleteVoice } = useDeleteVoice(songId, rightClicked)

    const history = useHistory()

    const handleAddInstrument = async (title: string) => {
        const { error, result } = await postVoice.run({
            insturment: title,
            voiceNumber: voices.length + 1,
        })

        if (!error && result) {
            onAddVoice(result.data)
            setModalIsOpen(false)
        }
    }

    const handleClose = () => {
        setModalIsOpen(false)
        setRenameModalIsOpen(false)
    }

    const handleCloseMenu = async (method: "deleteVoice" | "renameVoice") => {
        if (method === "renameVoice") {
            setRenameModalIsOpen(true)
        }
        if (method === "deleteVoice") {
            const { error, result } = await deleteVoice.run()

            if (!error && result) {
                onDeleteVoice(result.data)
            }
        }
        setPosition(undefined)
    }
    const handleChangeVoiceTitle = async (voiceTitle: string) => {
        const { error, result } = await putVoice.run({
            insturment: voiceTitle,
            voiceNumber: voices.length + 1,
        })

        if (!error && result) {
            onUpdateVoice(result.data)
            setRenameModalIsOpen(false)
        }
    }

    const handleRightClick = (voiceId: number) => (event: React.MouseEvent) => {
        event.preventDefault()
        setPosition({ top: event.clientY - 4, left: event.clientX - 2 })
        setRightClicked(voiceId)
    }

    return (
        <>
            <Box display="flex">
                <Tabs
                    value={selectedVoice}
                    indicatorColor="secondary"
                    textColor="secondary"
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
                                onContextMenu={handleRightClick(
                                    voice.songVoiceId
                                )}
                                onClick={() =>
                                    history.push(`?voice=${voice.songVoiceId}`)
                                }
                            />
                        )
                    })}
                </Tabs>
                <Button
                    onClick={() => setModalIsOpen(true)}
                    startIcon={<Add />}
                >
                    {t("CreateSongTab:newInstrument")}
                </Button>
            </Box>

            <InputModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={handleAddInstrument}
                handleClosed={() => handleClose()}
                modalOpen={modalIsOpen}
                saveText={t("Modal:create")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:addInstrument")}
                labelText={t("Modal:nameOfInstrument")}
            />
            <InputModal
                defaultValue={rightClicked ? voices[rightClicked].title : ""}
                handleOnCancelClick={handleClose}
                handleOnSaveClick={handleChangeVoiceTitle}
                handleClosed={handleClose}
                modalOpen={renameModalIsOpen}
                saveText={t("Modal:save")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:changeVoiceName")}
                labelText={t("Modal:newVoiceName")}
            />
            <Menu
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
            </Menu>
        </>
    )
}
