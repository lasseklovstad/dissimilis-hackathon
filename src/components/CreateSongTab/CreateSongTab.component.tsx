import React, { useContext, useState } from "react"
import { Grid, makeStyles, Menu, MenuItem } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { parse } from "query-string"

import {
    DashboardButton,
    DashboardButtonNoLink,
    DashboardButtonWithAddIconNoLink,
} from "../DashboardButtons/DashboardButtons"
import { SongContext } from "../../views/SongView/SongContextProvider.component"
import { IVoice } from "../../models/IVoice"
import { InputModal } from "../CustomModal/InputModal.component"
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component"

const useStyles = makeStyles({
    createSongTab: {
        marginBottom: "24px",
    },
})

export const CreateSongTab = () => {
    const classes = useStyles()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
    const [textFieldInput, setTextFieldInput] = useState<string>("")

    const history = useHistory()

    const {
        song: { voices, songId },
        addVoice,
        changeVoiceTitle,
    } = useContext(SongContext)
    const { setShowPossiblePositions } = useContext(SongToolsContext)

    const handleAddInstrument = () => {
        setShowPossiblePositions(false)
        addVoice({
            title: textFieldInput,
            partNumber: voices.length,
            bars: [],
            isMain: false,
        })
        setModalIsOpen(false)
        setTextFieldInput("")
        const newIndex = voices.length + 1
        history.replace(`?voice=${newIndex.toString()}`)
    }

    const handleClose = () => {
        setModalIsOpen(false)
        setRenameModalIsOpen(false)
    }

    const { t } = useTranslation()
    const voiceString = parse(window.location.search)
    const selectedVoice = parseInt(voiceString.voice as string, 10)
    const [rightClicked, setRightClicked] = useState(-1)

    const initialState = {
        mouseX: null,
        mouseY: null,
    }

    const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
        mouseX: null | number
        mouseY: null | number
    }>(initialState)

    const handleCloseMenu = (method?: string) => {
        if (method === "renameVoice") {
            setRenameModalIsOpen(true)
        }
        setRightClickCoordinates(initialState)
    }
    const handleChangeVoiceTitle = () => {
        setRenameModalIsOpen(false)
        changeVoiceTitle(rightClicked + 1, textFieldInput)
    }

    return (
        <Grid container>
            <Grid item xs="auto" sm={1} />
            <Grid item xs={12} sm={10}>
                <Grid container spacing={2} className={classes.createSongTab}>
                    <Grid item>
                        <DashboardButtonNoLink
                            selected={selectedVoice === 1}
                            text={t("CreateSongTab:song")}
                            func={() => {
                                history.replace(`/song/${songId}?voice=1`)
                            }}
                        />
                    </Grid>
                    {voices.slice(1).map((voices: IVoice, index: number) => {
                        return (
                            <Grid item key={index}>
                                <DashboardButton
                                    onContextMenu={(event) => {
                                        setRightClicked(index)
                                        event.preventDefault()
                                        setRightClickCoordinates({
                                            mouseX: event.clientX - 2,
                                            mouseY: event.clientY - 4,
                                        })
                                    }}
                                    selected={selectedVoice === index + 2}
                                    text={voices.title}
                                    link={`/song/${songId}?voice=${index + 2}`}
                                />
                                <Menu
                                    keepMounted
                                    open={rightClickCoordinates.mouseY !== null}
                                    onClose={() => {
                                        handleCloseMenu("")
                                    }}
                                    anchorReference="anchorPosition"
                                    anchorPosition={
                                        rightClickCoordinates.mouseY !== null &&
                                        rightClickCoordinates.mouseX !== null
                                            ? {
                                                  top:
                                                      rightClickCoordinates.mouseY,
                                                  left:
                                                      rightClickCoordinates.mouseX,
                                              }
                                            : undefined
                                    }
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleCloseMenu("renameVoice")
                                        }}
                                    >
                                        {t("CreateSongTab:changeVoiceName")}
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        )
                    })}
                    <Grid item>
                        <DashboardButtonWithAddIconNoLink
                            text={t("CreateSongTab:newInstrument")}
                            func={() => setModalIsOpen(true)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <InputModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={() => handleAddInstrument()}
                handleClosed={() => handleClose()}
                modalOpen={modalIsOpen}
                saveText={t("Modal:create")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:addInstrument")}
                labelText={t("Modal:nameOfInstrument")}
                handleChange={(txt) => setTextFieldInput(txt)}
            />
            <InputModal
                handleOnCancelClick={() => handleClose()}
                handleOnSaveClick={() => handleChangeVoiceTitle()}
                handleClosed={() => handleClose()}
                modalOpen={renameModalIsOpen}
                saveText={t("Modal:save")}
                cancelText={t("Modal:cancel")}
                headerText={t("Modal:changeVoiceName")}
                labelText={t("Modal:newVoiceName")}
                handleChange={(txt) => setTextFieldInput(txt)}
            />
            <Grid item xs="auto" sm={1} />
        </Grid>
    )
}
