import React, { useState, useContext } from 'react'
import { Grid, Menu, MenuItem, makeStyles } from '@material-ui/core'
import {
    DashboardButtonWithAddIconNoLink,
    DashboardButtonNoLink,
    DashboardButton,
} from '../DashboardButtons/DashboardButtons'
import { useTranslation } from 'react-i18next'
import { SongContext } from '../../views/SongView/SongContextProvider.component'
import { IVoice } from '../../models/IVoice'
import { useHistory } from 'react-router-dom'
import { InputModal } from '../CustomModal/InputModal.component'
import { SongToolsContext } from '../../views/SongView/SongToolsContextProvider.component'

export type CreateSongTabProps = {}

export type InstrumentCard = {
    name: string
    link: string
}
export const CreateSongTab: React.FC<CreateSongTabProps> = (props) => {
    const classes = useStyles()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
    const [textFieldInput, setTextFieldInput] = useState<string>('')

    const history = useHistory()

    const {
        song: { voices, id },
        addVoice,
        changeVoiceTitle,
    } = useContext(SongContext)
    const { setShowPossiblePositions } = useContext(SongToolsContext)

    const handleAddInstrument = () => {
        setShowPossiblePositions(false)
        addVoice({ title: textFieldInput, partNumber: voices.length, bars: [] })
        setModalIsOpen(false)
        setTextFieldInput('')
        const newIndex = voices.length + 1
        history.replace('?voice=' + newIndex.toString())
    }

    const handleOpen = () => {
        setModalIsOpen(true)
    }

    const handleClose = () => {
        setModalIsOpen(false)
        setRenameModalIsOpen(false)
    }

    const handleChange = (e: any) => {
        setTextFieldInput(e.target.value)
    }

    const { t } = useTranslation()
    const queryString = require('query-string')
    const voiceString = queryString.parse(window.location.search)
    const selectedVoice = parseInt(voiceString.voice)
    const [rightClicked, setRightClicked] = useState(-1)

    const initialState = {
        mouseX: null,
        mouseY: null,
    }

    const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
        mouseX: null | number
        mouseY: null | number
    }>(initialState)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        setRightClickCoordinates({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        })
    }
    const handleCloseMenu = (method?: string) => {
        if (method === 'renameVoice') {
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
            <Grid item xs={'auto'} sm={1}></Grid>
            <Grid item xs={12} sm={10}>
                <Grid container spacing={2} className={classes.createSongTab}>
                    <Grid item>
                        <DashboardButtonNoLink
                            selected={selectedVoice === 1}
                            text={t('CreateSongTab:song')}
                            func={() => {
                                history.replace(`/song/${id}?voice=1`)
                            }}
                        />
                    </Grid>
                    {voices.slice(1).map((voices: IVoice, index: number) => {
                        return (
                            <Grid item key={index}>
                                <DashboardButton
                                    onContextMenu={(
                                        e: React.MouseEvent<
                                            HTMLDivElement,
                                            MouseEvent
                                        >
                                    ) => {
                                        setRightClicked(index)
                                        handleClick(e)
                                    }}
                                    selected={selectedVoice === index + 2}
                                    text={voices.title}
                                    link={`/song/${id}?voice=${index + 2}`}
                                />
                                <Menu
                                    keepMounted
                                    open={rightClickCoordinates.mouseY !== null}
                                    onClose={() => {
                                        handleCloseMenu('')
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
                                            handleCloseMenu('renameVoice')
                                        }}
                                    >
                                        {t('CreateSongTab:changeVoiceName')}
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        )
                    })}
                    <Grid item>
                        <DashboardButtonWithAddIconNoLink
                            text={t('CreateSongTab:newInstrument')}
                            func={handleOpen}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <InputModal
                handleOnCancelClick={() => handleClose}
                handleOnSaveClick={() => handleAddInstrument}
                handleClosed={() => handleClose}
                modalOpen={modalIsOpen}
                saveText={t('Modal:create')}
                cancelText={t('Modal:cancel')}
                headerText={t('Modal:addInstrument')}
                labelText={t('Modal:nameOfInstrument')}
                handleChange={handleChange}
            />
            <InputModal
                handleOnCancelClick={() => handleClose}
                handleOnSaveClick={() => handleChangeVoiceTitle}
                handleClosed={() => handleClose}
                modalOpen={renameModalIsOpen}
                saveText={t('Modal:save')}
                cancelText={t('Modal:cancel')}
                headerText={t('Modal:changeVoiceName')}
                labelText={t('Modal:newVoiceName')}
                handleChange={handleChange}
            />
            <Grid item xs={'auto'} sm={1}></Grid>
        </Grid>
    )
}

const useStyles = makeStyles({
    createSongTab: {
        marginBottom: '24px',
    },
})

export default CreateSongTab
