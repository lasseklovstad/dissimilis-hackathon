import React, { useEffect } from "react"
import makeStyles from "@mui/styles/makeStyles"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Popper,
    PopperProps,
    TextField,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { getColor, tangentToNumber } from "../../utils/bar.util"
import { ChordType } from "../../models/IChordMenuOptions"
import {
    commonChords,
    getNotesFromChord,
    toneNames,
} from "../../models/commonChords"
import { useSongContext } from "../../context/song/SongContextProvider.component"
import {
    useGetChordIntervals,
    useOptions,
} from "../../utils/useApiServiceGlobalNote.util"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"

const useStyles = makeStyles({
    button: {
        backgroundColor: colors.white,
        boxShadow: "0px 0px 0px rgba(255, 255, 255, 0)",
        margin: "auto",
    },
    addbutton: {
        backgroundColor: colors.white,
        border: "none",
        height: "56px",
        outline: "none",
    },
    icon: {
        right: 7,
    },
    root: {
        display: "flex",
        justifyContent: "space-between",
        padding: "7px 8px",
        height: "auto",
    },
})

export const ChordOptions = (props: {
    chord: string
    addChordInterval: (intervalPosition: number) => void
    removeChordInterval: (intervalPosition: number) => void
}) => {
    const { chord, addChordInterval, removeChordInterval } = props
    const styles = useStyles()
    const { state, chordIntervalsData } = useGetChordIntervals(chord)
    const { t } = useTranslation()

    if (!chordIntervalsData) {
        return null
    }

    return (
        <Box className={styles.root}>
            <FormGroup row>
                {chordIntervalsData.intervalNames.map(
                    (interval, intervalPosition) => {
                        return (
                            <FormControlLabel
                                key={interval}
                                control={
                                    <Checkbox
                                        color="default"
                                        onChange={(e) =>
                                            e.target.checked
                                                ? addChordInterval(
                                                      intervalPosition
                                                  )
                                                : removeChordInterval(
                                                      intervalPosition
                                                  )
                                        }
                                        name={interval}
                                    />
                                }
                                label={interval}
                            />
                        )
                    }
                )}
            </FormGroup>
        </Box>
    )
}

export const MenuButtonWithAddIcon = (props: {
    text: string
    onClick?: () => void
}) => {
    return (
        <Paper elevation={6} sx={{ display: "flex", m: 1 }}>
            <Button
                disableFocusRipple
                size={"large"}
                startIcon={<AddIcon />}
                onClick={() => props.onClick && props.onClick()}
            >
                {props.text}
            </Button>
        </Paper>
    )
}

const customPopperPlacement = (props: PopperProps) => {
    return <Popper {...props} placement="top" children={props.children} />
}

export const DropdownAutocomplete = () => {
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const {
        state,
        optionData: { singleNoteOptions, chordOptions },
    } = useOptions()
    const dropdownOptions =
        chordMenuOptions.chordType === "CHORD"
            ? chordOptions
            : singleNoteOptions

    const { t } = useTranslation()

    return (
        <Autocomplete<string>
            sx={{
                display: "flex",
                alignItems: "center",
                width: "150px",
            }}
            options={dropdownOptions}
            loading={state.loading}
            value={chordMenuOptions.chord}
            filterOptions={(options, selected) => {
                if (
                    chordMenuOptions.chordType === "CHORD" &&
                    !selected.inputValue
                ) {
                    // Chord list is too long to render on no input value
                    return commonChords
                }
                return options.filter((option) => {
                    return option.indexOf(selected.inputValue) === 0
                })
            }}
            onChange={(event, value) => {
                if (typeof value === "string") {
                    setChordMenuOptions((options) => ({
                        ...options,
                        chord: value,
                    }))
                }
            }}
            blurOnSelect="touch"
            openText={t("BottomBar.open")}
            PopperComponent={customPopperPlacement}
            clearIcon={false}
            noOptionsText={t("BottomBar.noOptions")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    hiddenLabel
                    sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "0px",
                        },
                    }}
                    variant={"outlined"}
                    inputProps={{
                        ...params.inputProps,
                        "aria-label": t(
                            `BottomBar.${
                                chordMenuOptions.chordType === "NOTE"
                                    ? "noteLabel"
                                    : "chordLabel"
                            }`
                        ),
                    }}
                />
            )}
            renderOption={(props, options) => (
                <li {...props}>
                    <Grid container>
                        <Grid item xs={9}>
                            <Typography>{options}</Typography>
                        </Grid>
                        <Grid item xs={3} aria-hidden>
                            {chordMenuOptions.chordType === ChordType.NOTE ? (
                                <Box
                                    style={{
                                        height: "24px",
                                        width: "24px",
                                        backgroundColor: getColor(options),
                                        borderRadius: "5px",
                                        verticalAlign: "center",
                                    }}
                                >
                                    {tangentToNumber(options) !== 0 ? (
                                        <Typography
                                            style={{
                                                color: colors.white,
                                                textAlign: "center",
                                            }}
                                        >
                                            {tangentToNumber(options)}
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                </Box>
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                </li>
            )}
        />
    )
}
