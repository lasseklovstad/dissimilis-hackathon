import React, { useEffect, useState, useRef } from "react"
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
})
const heightAvailableToBars = 770
const barsConfig = [
    { barsPerRow: 1, lengthOfBar: 12 },
    { barsPerRow: 2, lengthOfBar: 6 },
    { barsPerRow: 4, lengthOfBar: 3 },
    { barsPerRow: 6, lengthOfBar: 2 },
]

const rowsPerSheetConfig = [
    { rowsPerSheet: 1, heightAvailableToBars },
    { rowsPerSheet: 2, heightAvailableToBars: heightAvailableToBars / 2 - 20 },
    { rowsPerSheet: 3, heightAvailableToBars: heightAvailableToBars / 3 - 30 },
    { rowsPerSheet: 4, heightAvailableToBars: heightAvailableToBars / 4 - 30 },
    { rowsPerSheet: 5, heightAvailableToBars: heightAvailableToBars / 5 - 30 },
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
    const [selectedBarConfig, setSelectedBarConfig] = useState(barsConfig[2])
    const [
        selectedRowsPerSheetConfig,
        setSelectedRowsPerSheetConfig,
    ] = useState(rowsPerSheetConfig[3])
    const [amountOfPages, setAmountOfPages] = useState<number>(1)
    const { songId } = useParams<{ songId: string }>()
    const { songInit } = useGetSong(songId)
    const selectedVoiceId = useVoice(songInit?.voices)
    const selectedVoice = songInit?.voices.find(
        (voice) => voice.songVoiceId === selectedVoiceId
    )

    const classes = useStyles()
    const history = useHistory()
    const { t } = useTranslation()

    useEffect(() => {
        if (!selectedVoice) {
            setAmountOfPages(1)
            return
        }
        const amountOfBars = selectedVoice.bars.length || 0

        const totalRowsUsed = Math.ceil(
            amountOfBars / selectedBarConfig.barsPerRow
        )
        const heightOfDiv =
            totalRowsUsed * selectedRowsPerSheetConfig.heightAvailableToBars

        const amountOfPagesCalculated = Math.ceil(heightOfDiv / 770)
        if (amountOfPagesCalculated === 0) {
            setAmountOfPages(1)
        } else {
            setAmountOfPages(amountOfPagesCalculated)
        }
    }, [selectedRowsPerSheetConfig, selectedBarConfig, selectedVoice])

    return (
        <>
            {Array.from(Array(amountOfPages), (e, pageIndex) => {
                return (
                    <Box className={`${classes.root} page`} key={pageIndex}>
                        {selectedVoice && songInit && (
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "center" }}
                                        variant="h1"
                                    >
                                        {songInit?.title}
                                    </Typography>
                                    <Typography
                                        style={{ textAlign: "center" }}
                                        variant="body1"
                                    >
                                        {selectedVoice?.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        {selectedVoice?.bars.length === 0 ? (
                                            <></>
                                        ) : (
                                            <Song
                                                barsPerRow={
                                                    selectedBarConfig.barsPerRow
                                                }
                                                exportMode
                                                showChordLetters={
                                                    showChordLetters
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
                                                setValuesForSelectedNote={() =>
                                                  undefined
                                                }
                                                selectedNoteId={undefined}
                                                refHighlightedNote={undefined}
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
                                {t("ExportView:voice")}
                            </InputLabel>
                            <Select
                                labelId="voice"
                                value={songInit ? selectedVoiceId : ""}
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
                                            {voice.title}
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
                                {t("ExportView:barPerRow")}
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
                                {t("ExportView:rowsPerSheet")}
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
                        className={`${classes.box} ${classes.flexCenter}`}
                        style={{
                            order: 4,
                        }}
                    >
                        <FormGroup
                            className={`${classes.formControl} ${classes.alignCenter}`}
                        >
                            <FormControlLabel
                                label={t("ExportView:chortLetters")}
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
                    <Grid item xs={3} className={classes.exportButtons}>
                        <Button
                            className={`${classes.confirmOrCancelButtons} ${classes.confirmButton}`}
                            onClick={() => window.print()}
                        >
                            {t("ExportView:createPDF")}
                        </Button>
                        <Button
                            className={classes.confirmOrCancelButtons}
                            onClick={() => history.push(`/song/${songId}/`)}
                        >
                            {t("ExportView:cancel")}
                        </Button>
                    </Grid>
                </Grid>
            </BottomNavigation>
        </>
    )
}
