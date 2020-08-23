import React, { useState, useEffect } from 'react'
import { Grid, Typography, Box, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import {
    DashboardButton,
    DashboardLibraryButton,
    DashboardButtonWithAddIconNoLink,
} from '../../components/DashboardButtons/DashboardButtons'
import { DashboardTopBar } from '../../components/DashboardTopBar/DashboardTopBar'
import {
    useGetRecentSongs,
    useGetFilteredSongs,
    usePostSong,
} from '../../utils/useApiServiceSongs'
import { ISong } from '../../models/ISong'
import { InputModal } from '../../components/CustomModal/InputModal.component'
import { useHistory } from 'react-router-dom'

export type DashboardViewProps = {}

export const DashboardView: React.FC<DashboardViewProps> = () => {
    const styles = useStyles()
    const { t } = useTranslation()

    const [dashboardView, setDashboardView] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])
    const [recentSongs, setRecentSongs] = useState<ISong[]>([])
    const [addSongModalIsOpen, setAddSongModalIsOpen] = useState(false)
    const [timeSignature, setTimeSignature] = useState('')
    const [textFieldInput, setTextFieldInput] = useState<string>('')

    const postSong = usePostSong(textFieldInput, timeSignature)
    const history = useHistory()
    const measureText = t('DashboardView:measure')
    const getRecentSongs = useGetRecentSongs()
    const getFilteredSongs = useGetFilteredSongs(searchTerm)
    const marginBottom = 10

    useEffect(() => {
        getRecentSongs().then(({ result }) => {
            setRecentSongs(result?.data || [])
        })
    }, [])

    useEffect(() => {
        getFilteredSongs().then(({ result }) => {
            setFilteredSongs(result?.data || [])
        })
    }, [searchTerm])

    const musicTacts: musicTacts[] = [
        {
            id: 1,
            text: '2/4',
        },
        {
            id: 2,
            text: '3/4',
        },
        {
            id: 3,
            text: '4/4',
        },
        {
            id: 4,
            text: '6/8',
        },
    ]

    const handleAddSong = () => {
        setAddSongModalIsOpen(false)
        postSong().then(({ result }) => {
            if (result?.status === 201) {
                history.push('/song/' + result.data.id)
            }
        })
    }

    const handleOpenAddSongModal = (song: musicTacts) => {
        setTimeSignature(song.text)
        setAddSongModalIsOpen(true)
    }

    const handleClose = () => {
        setAddSongModalIsOpen(false)
    }

    const handleOnChangeAddSongModal: React.ChangeEventHandler<
        HTMLTextAreaElement | HTMLInputElement
    > = (e: any) => {
        setTextFieldInput(e.target.value)
    }

    const handleOnBlurSearch = () => {
        setTimeout(() => {
            setDashboardView(true)
        }, 320)
    }

    const handleOnChangeSearch = (searchTermParam: string) => {
        setSearchTerm(searchTermParam)
        setDashboardView(false)
    }

    return (
        <Box mx={2}>
            <Grid container justify="center" className={styles.container}>
                <Grid item xs={12}>
                    <Box mb={marginBottom}>
                        <DashboardTopBar
                            onBlur={handleOnBlurSearch}
                            onChange={handleOnChangeSearch}
                        />
                    </Box>
                </Grid>

                {dashboardView ? (
                    <>
                        <Grid item xs={12} sm={10} key="newSongContainer">
                            <Box mb={marginBottom}>
                                <Box mb={2}>
                                    <Typography variant="h1">
                                        {t('DashboardView:newSongLabel')}
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {musicTacts.map((song) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            lg={3}
                                            key={song.id}
                                        >
                                            <DashboardButtonWithAddIconNoLink
                                                func={() =>
                                                    handleOpenAddSongModal(song)
                                                }
                                                text={
                                                    song.text +
                                                    '-' +
                                                    measureText
                                                }
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={10} key="recentSongsContainer">
                            <Box mb={marginBottom}>
                                <Box mb={2}>
                                    <Typography variant="h1">
                                        {t('DashboardView:recentSongLabel')}
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    {recentSongs?.map((song, index) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={4}
                                            lg={3}
                                            key={song.id}
                                        >
                                            <DashboardButton
                                                text={song.title}
                                                link={
                                                    '/song/' +
                                                    song.id!.toString()
                                                }
                                            />
                                        </Grid>
                                    ))}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        lg={3}
                                        key="library"
                                    >
                                        <DashboardLibraryButton
                                            text={t(
                                                'DashboardView:libraryButton'
                                            )}
                                            link={'/library'}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <InputModal
                            handleOnCancelClick={() => handleClose}
                            handleOnSaveClick={() => handleAddSong}
                            handleClosed={() => handleClose}
                            modalOpen={addSongModalIsOpen}
                            saveText={t('Modal:create')}
                            cancelText={t('Modal:cancel')}
                            headerText={t('Modal:addSong')}
                            labelText={t('Modal:nameOfSong')}
                            handleChange={handleOnChangeAddSongModal}
                        />
                    </>
                ) : (
                    <Grid item xs={12} sm={10} key="searchSongsContainer">
                        <Box mb={marginBottom}>
                            <Box m={2}>
                                <Typography variant="h1">
                                    {t('DashboardView:searchSongLabel')}
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {filteredSongs?.map((song) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        lg={3}
                                        key={song.id}
                                    >
                                        <DashboardButton
                                            text={song.title}
                                            link={
                                                '/song/' + song.id!.toString()
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}
export default DashboardView

const useStyles = makeStyles({
    container: {
        width: '100%',
    },
})

export type musicTacts = {
    id: number
    text: string
}
