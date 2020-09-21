import React, { useContext, useState } from "react"
import { useHistory, useParams, useRouteMatch } from "react-router-dom"
import {
    Grid,
    makeStyles,
    useMediaQuery,
    Box,
    Snackbar,
    Typography,
} from "@material-ui/core"
import { parse } from "query-string"
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert"
import { NavBarCreateSong } from "../../components/NavBarCreateSong/NavBarCreateSong.component"
import { CreateSongTab } from "../../components/CreateSongTab/CreateSongTab.component"
import { SongContext } from "./SongContextProvider.component"
import {
    TimeSignature,
    BarNumber,
} from "../../components/SongViewComponents/SongView.component"
import { BarContainer } from "../../components/BarContainer/BarContainer.component"
import { BottomBar } from "../../components/BottomBar/BottomBar.component"
import animatedBird from "../../assets/images/sommerfugl-animert.svg"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"
import { Loading } from "../../components/loading/Loading.component"
import { IBar } from "../../models/IBar"
import { BarLine } from "../../components/barLine/BarLine.component"
import { BarMenu } from "../../components/BarMenu/BarMenu.component"
import { Song } from "../../components/Song/Song.component"

const useStyles = makeStyles({
    root: {
        marginLeft: "16px",
        marginTop: "32px",
        marginRight: "16px",
        marginBottom: "120px",
        "@media (max-width: 1080px)": {
            marginBottom: "160px",
        },
        width: "auto",
    },
})

const heightOfBar = 160

const BarPrefix = (props: { index: number; timeSignature: string }) => {
    const { index, timeSignature } = props

    const getPrefixItem = () => {
        if (index === 0) {
            return <TimeSignature timeSignature={timeSignature} />
        }
        return <BarNumber barNumber={index + 1} />
    }
    const PrefixItem = getPrefixItem()

    return <Box flexGrow={0}>{PrefixItem}</Box>
}

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useBarsPerRow = () => {
    const xs = useMediaQuery("(max-width: 600px)")
    const xl = useMediaQuery("(min-width: 1920px)")
    const getBarPerRow = () => {
        if (xs) {
            return 1
        }
        if (xl) {
            return 4
        }
        return 2
    }

    return { barsPerRow: getBarPerRow() }
}

const useVoice = (numberOfVoices: number) => {
    const history = useHistory()
    const { id } = useParams<{ id: string }>()
    const voiceString = parse(history.location.search)
    let selectedVoice = 0
    if (typeof voiceString.voice === "string") {
        const voiceInt = parseInt(voiceString.voice, 10)
        if (voiceInt > numberOfVoices || voiceInt <= 0) {
            history.replace(`/song/${id}?voice=1`)
        } else {
            selectedVoice = voiceInt - 1
        }
    } else {
        history.replace(`/song/${id}?voice=1`)
    }

    return selectedVoice
}

export const SongView = () => {
    const classes = useStyles()

    const {
        song: { voices, timeSignature },
        isLoading,
        isSaving,
        setIsSaving,
    } = useContext(SongContext)

    const { barsPerRow } = useBarsPerRow()
    const selectedVoice = useVoice(voices.length)

    const handleClose = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        setIsSaving(false)
    }
    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <NavBarCreateSong />
                </Grid>
                <Grid item xs={12}>
                    <CreateSongTab />
                </Grid>
                {isLoading ? (
                    <Grid item xs={12}>
                        <LoadingLogo />
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Song
                            barsPerRow={barsPerRow}
                            selectedVoice={selectedVoice}
                            bars={voices[selectedVoice].bars}
                            timeSignature={timeSignature}
                            heightOfBar={heightOfBar}
                        />
                    </Grid>
                )}
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={4000}
                open={isSaving}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success">
                    <Typography variant="caption">Lagring vellykket</Typography>
                </Alert>
            </Snackbar>
            <BottomBar />
        </>
    )
}
