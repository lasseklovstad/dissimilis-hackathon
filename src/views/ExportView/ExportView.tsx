import React, { useEffect, useState } from "react"
import {
    BottomNavigation,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Switch,
    Typography,
    withStyles,
} from "@material-ui/core"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { Song } from "../../components/Song/Song.component"
import { useGetSong } from "../../utils/useApiServiceSongs"
import { useVoice } from "../../utils/useVoice"
import { LoadingLogo } from "../../components/loadingLogo/LoadingLogo.component"

const useStyles = makeStyles({
    root: {
        border: "1px solid black",
        "@media print": {
            border: "none",
        },
    },
    flexCenter: {
        display: "flex",
        alignItems: "center",
    },
    flexStart: {
        display: "flex",
        alignItems: "flex-start",
    },
    alignCenter: { alignItems: "center" },
    box: {
        padding: "8px",
        margin: "4px",
        backgroundColor: "white",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",
    },
    formControl: {
        width: "100%",
    },
    button: {
        backgroundColor: colors.gray_100,
        marginRight: "4px",
        marginBottom: "4px",
        borderRadius: "4px",
        border: "1px solid #E0E0E0",
        height: "100%",
    },
    slider: {
        padding: "8px",
        backgroundColor: "white",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",
    },
    stickToBottom: {
        width: "100%",
        position: "fixed",
        height: "auto",
        paddingTop: "24px",
        paddingBottom: "24px",
        bottom: 0,
        borderTop: `1px solid ${colors.gray_300}`,
        backgroundColor: colors.gray_100,
    },
    confirmOrCancelButtons: {
        backgroundColor: " ",
        height: "100%",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",
    },
    confirmButton: {
        backgroundColor: colors.teal_100,
        marginRight: 8,
    },
    exportButtons: {
        margin: "4px",
        backgroundColor: "transparent",
        order: 5,
        display: "flex",
        justifyContent: "flex-end",
    },
    chordLetters: {
        fontSize: "0.78rem",
        color: "rgba(0, 0, 0, 0.54)",
        paddingBottom: "6px",
    },
})
const heightAvailableToBars = 725
const barsConfig = [
    { barsPerRow: 1, lengthOfBar: 12 },
    { barsPerRow: 2, lengthOfBar: 6 },
    { barsPerRow: 4, lengthOfBar: 3 },
    { barsPerRow: 6, lengthOfBar: 2 },
]

const rowsPerSheetConfig = [
    { rowsPerSheet: 1, heightAvailableToBars },
    { rowsPerSheet: 2, heightAvailableToBars: heightAvailableToBars / 2 },
    { rowsPerSheet: 3, heightAvailableToBars: heightAvailableToBars / 3 },
    { rowsPerSheet: 4, heightAvailableToBars: heightAvailableToBars / 4 },
    { rowsPerSheet: 5, heightAvailableToBars: heightAvailableToBars / 5 },
]

const CustomSwitch = withStyles({
    switchBase: {
        color: colors.teal_100,
        "&$checked": {
            color: colors.teal_100,
        },
        "&$checked + $track": {
            backgroundColor: colors.teal_100,
        },
    },
    checked: {},
    track: {},
})(Switch)

export const ExportView = () => {
    const [showChordLetters, setShowChordLetters] = useState(true)
    const [showNoteLetters, setShowNoteLetters] = useState(true)
    const [selectedBarConfig, setSelectedBarConfig] = useState(barsConfig[2])
    const [selectedRowsPerSheetConfig, setSelectedRowsPerSheetConfig] =
        useState(rowsPerSheetConfig[3])
    const [amountOfPages, setAmountOfPages] = useState<number>(1)
    const { songId: songIdString } = useParams<{ songId: string }>()
    const songId = Number(songIdString)
    const { songInit, getSong } = useGetSong(songId)
    const selectedVoice = useVoice(songInit?.voices)
    const mainVoice = songInit?.voices.find((voice) => voice.isMain)
    const getChordNameFromMainVoice = (
        barPosition: number,
        chordPosition: number
    ) => {
        return mainVoice?.bars
            .find((mainBar) => mainBar.position === barPosition)
            ?.chords.find((mainChord) => mainChord.position === chordPosition)
            ?.chordName
    }

    const classes = useStyles()
    const history = useHistory()
    const { t } = useTranslation()

    useEffect(() => {
        if (selectedVoice) {
            const amountOfBars = selectedVoice.bars.length || 0

            const totalRowsUsed = Math.ceil(
                amountOfBars / selectedBarConfig.barsPerRow
            )
            const heightOfDiv =
                totalRowsUsed * selectedRowsPerSheetConfig.heightAvailableToBars

            const amountOfPagesCalculated = Math.ceil(heightOfDiv / 725)

            if (amountOfPagesCalculated === 0) {
                setAmountOfPages(1)
            } else {
                setAmountOfPages(amountOfPagesCalculated)
            }
        }
    }, [selectedRowsPerSheetConfig, selectedBarConfig, selectedVoice])

    if (getSong.loading) {
        return <LoadingLogo />
    }

    return (
        <>
            {Array.from(Array(amountOfPages), (e, pageIndex) => {
                return (
                    <Box className={`${classes.root} page`} key={pageIndex}>
                        {selectedVoice && songInit && (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            textAlign: "center",
                                            fontSize: "1.75rem",
                                        }}
                                    >
                                        {songInit?.title}
                                    </Typography>
                                    <Typography
                                        style={{ textAlign: "center" }}
                                        variant="body1"
                                    >
                                        {selectedVoice?.isMain
                                            ? t("CreateSongTab.song")
                                            : selectedVoice?.voiceName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        {selectedVoice?.bars.length === 0 ? (
                                            <></>
                                        ) : (
                                            <Song
                                                updateAll={()=>{}}
                                                barsPerRow={
                                                    selectedBarConfig.barsPerRow
                                                }
                                                exportMode
                                                showChordLetters={
                                                    showChordLetters
                                                }
                                                showNoteLetters={
                                                    showNoteLetters
                                                }
                                                voice={{
                                                    ...selectedVoice,
                                                    bars:
                                                        selectedVoice.bars.slice(
                                                            pageIndex *
                                                                (selectedRowsPerSheetConfig.rowsPerSheet *
                                                                    selectedBarConfig.barsPerRow),
                                                            (pageIndex + 1) *
                                                                selectedRowsPerSheetConfig.rowsPerSheet *
                                                                selectedBarConfig.barsPerRow
                                                        ) || [],
                                                }}
                                                getChordNameFromMainVoice={
                                                    getChordNameFromMainVoice
                                                }
                                                timeSignature={{
                                                    denominator:
                                                        songInit?.denominator ||
                                                        4,
                                                    numerator:
                                                        songInit?.numerator ||
                                                        4,
                                                }}
                                                heightOfBar={
                                                    selectedRowsPerSheetConfig.heightAvailableToBars
                                                }
                                                lastPage={
                                                    amountOfPages ===
                                                    pageIndex + 1
                                                }
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                )
            })}
            <BottomNavigation className={`${classes.stickToBottom} no-print`}>
                <Grid container style={{ margin: "auto" }} justify="center">
                    <Grid
                        item
                        xs={2}
                        className={classes.box}
                        style={{
                            order: 1,
                        }}
                    >
                        <FormControl className={classes.formControl}>
                            <InputLabel id="voice">
                                {t("ExportView.voice")}
                            </InputLabel>
                            <Select
                                labelId="voice"
                                value={
                                    songInit ? selectedVoice?.songVoiceId : ""
                                }
                                onChange={(ev) => {
                                    history.push(
                                        `/song/${songId}/export?voice=${ev.target.value}`
                                    )
                                }}
                            >
                                {songInit?.voices.map((voice) => {
                                    return (
                                        <MenuItem
                                            key={voice.songVoiceId}
                                            value={voice.songVoiceId}
                                        >
                                            {voice.isMain
                                                ? t("CreateSongTab.song")
                                                : voice.voiceName}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        className={classes.box}
                        style={{
                            order: 2,
                        }}
                    >
                        <FormControl className={classes.formControl}>
                            <InputLabel id="barPerRow">
                                {t("ExportView.barPerRow")}
                            </InputLabel>
                            <Select
                                labelId="barPerRow"
                                value={selectedBarConfig.barsPerRow}
                                onChange={(ev) => {
                                    setSelectedBarConfig(
                                        barsConfig.find(
                                            (config) =>
                                                config.barsPerRow ===
                                                ev.target.value
                                        ) || barsConfig[0]
                                    )
                                }}
                            >
                                {barsConfig.map((barConfig) => {
                                    return (
                                        <MenuItem
                                            key={barConfig.barsPerRow}
                                            value={barConfig.barsPerRow}
                                        >
                                            {barConfig.barsPerRow}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        className={classes.box}
                        style={{
                            order: 3,
                        }}
                    >
                        <FormControl className={classes.formControl}>
                            <InputLabel id="rowsPerSheet">
                                {t("ExportView.rowsPerSheet")}
                            </InputLabel>
                            <Select
                                labelId="rowsPerSheet"
                                value={selectedRowsPerSheetConfig.rowsPerSheet}
                                onChange={(ev) =>
                                    setSelectedRowsPerSheetConfig(
                                        rowsPerSheetConfig.find(
                                            (config) =>
                                                config.rowsPerSheet ===
                                                ev.target.value
                                        ) || rowsPerSheetConfig[0]
                                    )
                                }
                            >
                                {rowsPerSheetConfig.map((rowsPerSheet) => {
                                    return (
                                        <MenuItem
                                            key={rowsPerSheet.rowsPerSheet}
                                            value={rowsPerSheet.rowsPerSheet}
                                        >
                                            {rowsPerSheet.rowsPerSheet}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        md={1}
                        className={`${classes.box} ${classes.flexCenter}`}
                        style={{
                            order: 4,
                        }}
                    >
                        <FormGroup
                            className={`${classes.formControl} ${classes.flexStart}`}
                        >
                            <Typography className={classes.chordLetters}>
                                {t("ExportView.chordLetters")}
                            </Typography>
                            <FormControlLabel
                                label={
                                    showChordLetters
                                        ? t("ExportView.showChordLetters")
                                        : t("ExportView.hideChordLetters")
                                }
                                className={classes.flexStart}
                                style={{
                                    margin: 0,
                                    fontSize: "10px",
                                }}
                                control={
                                    <CustomSwitch
                                        size="small"
                                        checked={showChordLetters}
                                        onChange={() =>
                                            setShowChordLetters(
                                                !showChordLetters
                                            )
                                        }
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        md={1}
                        className={`${classes.box} ${classes.flexCenter}`}
                        style={{
                            order: 4,
                        }}
                    >
                        <FormGroup
                            className={`${classes.formControl} ${classes.flexStart}`}
                        >
                            <Typography className={classes.chordLetters}>
                                {t("ExportView.noteLetters")}
                            </Typography>
                            <FormControlLabel
                                label={
                                    showNoteLetters
                                        ? t("ExportView.showChordLetters")
                                        : t("ExportView.hideChordLetters")
                                }
                                className={classes.flexStart}
                                style={{
                                    margin: 0,
                                    fontSize: "10px",
                                }}
                                control={
                                    <CustomSwitch
                                        size="small"
                                        checked={showNoteLetters}
                                        onChange={() =>
                                            setShowNoteLetters(!showNoteLetters)
                                        }
                                    />
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={3} className={classes.exportButtons}>
                        <Button
                            className={`${classes.confirmOrCancelButtons} ${classes.confirmButton}`}
                            disableFocusRipple
                            onClick={() => window.print()}
                        >
                            {t("ExportView.createPDF")}
                        </Button>
                        <Button
                            className={classes.confirmOrCancelButtons}
                            disableFocusRipple
                            onClick={() => history.push(`/song/${songId}/`)}
                        >
                            {t("ExportView.cancel")}
                        </Button>
                    </Grid>
                </Grid>
            </BottomNavigation>
        </>
    )
}
