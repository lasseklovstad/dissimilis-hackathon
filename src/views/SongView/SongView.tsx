import React, { useContext } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
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

export const SongView = () => {
    const classes = useStyles()

    const {
        song: { voices },
        isLoading,
        isSaving,
        setIsSaving,
    } = useContext(SongContext)

    const xs = useMediaQuery("(max-width: 600px)")
    const xl = useMediaQuery("(min-width: 1920px)")
    const history = useHistory()
    const match = useRouteMatch<{ id: string }>("/song/:id")
    const id = match ? +match.params.id : 0
    const voiceString = parse(window.location.search)
    let selectedVoice = 0
    if (typeof voiceString.voice === "string") {
        const voiceInt = parseInt(voiceString.voice, 10)
        if (voiceInt > voices.length || voiceInt <= 0) {
            history.replace(`/song/${id}?voice=1`)
        } else {
            selectedVoice = voiceInt - 1
        }
    } else {
        history.replace(`/song/${id}?voice=1`)
    }

    /**
     * This method checks if the bar is on a new line, and therefore should have a barline before the bar
     * @param index
     */
    const isBarLineBefore = (index: number) => {
        return xl && index % 4 === 0
            ? true
            : !xs && !xl && index % 2 === 0
            ? true
            : !!xs
    }

    /**
     * This method checks if the bar is the last one, and therefore gets a double barline
     * @param index
     */
    const isBarLineAfter = (index: number) => {
        return index === voices[selectedVoice].bars.length - 1
    }

    const handleClose = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        setIsSaving(false)
    }

    const Alert = (props: AlertProps) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    const heightOfBar = 160
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
                        <Box width="30%" margin="auto">
                            <object
                                type="image/svg+xml"
                                data={animatedBird}
                                aria-label="bird moving"
                                style={{ width: "100%", height: "20%" }}
                            />
                        </Box>
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        {" "}
                        {/* Grid for main container, containing the bars, timeSignature and barnumber */}
                        <Grid container>
                            <Grid item xs={1}>
                                {voices[selectedVoice].bars.map((bar, i) => {
                                    if (i === 0) {
                                        return (
                                            <TimeSignature
                                                key={i}
                                                height={heightOfBar}
                                            />
                                        )
                                    }
                                    if (xl && i % 4 === 0) {
                                        return (
                                            <BarNumber
                                                key={i}
                                                barNumber={i + 1}
                                                height={heightOfBar}
                                            />
                                        )
                                    }
                                    if (!xs && !xl && i % 2 === 0) {
                                        return (
                                            <BarNumber
                                                key={i}
                                                barNumber={i + 1}
                                                height={heightOfBar}
                                            />
                                        )
                                    }
                                    if (xs) {
                                        return (
                                            <BarNumber
                                                key={i}
                                                barNumber={i + 1}
                                                height={heightOfBar}
                                            />
                                        )
                                    }
                                    return <div key={i} />
                                })}
                            </Grid>

                            <Grid item xs={10}>
                                <Grid container>
                                    {voices[selectedVoice].bars.map(
                                        (bar, i) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                xl={3}
                                                key={i}
                                            >
                                                <BarContainer
                                                    voiceId={selectedVoice}
                                                    masterSheet={
                                                        selectedVoice === 0
                                                    }
                                                    barNumber={bar.barNumber}
                                                    bar={bar}
                                                    barLineBefore={isBarLineBefore(
                                                        i
                                                    )}
                                                    barLineAfter={isBarLineAfter(
                                                        i
                                                    )}
                                                    height={heightOfBar}
                                                />
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
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
