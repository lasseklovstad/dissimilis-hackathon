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
import { useSongContext } from "../../views/SongView/SongContextProvider.component"
import { useOptions } from "../../utils/useApiServiceGlobalNote.util"

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
    dropdown: {
        "& .MuiOutlinedInput-notchedOutline": {
            border: "0px",
        },
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
    chord: string | null
    onChordNotesChange: (clickedNote: string, checked: boolean) => void
    changeComponentInterval?: (index: number) => void
    alwaysShow: boolean
    customMode?: boolean
    indexArray?: boolean[]
}) => {
    const {
        alwaysShow,
        customMode = false,
        indexArray = [],
        changeComponentInterval = () => {},
    } = props
    const styles = useStyles()
    const { chordMenuOptions } = useSongContext()
    const { t } = useTranslation()

    if (!alwaysShow && chordMenuOptions?.chordType === ChordType.NOTE) {
        return <></>
    }

    const allNotes = getNotesFromChord(props.chord)

    return (
        <Box id="chordOptionsContainer" className={styles.root}>
            <FormGroup id="chordOptions" row>
                {allNotes.map((note, i) => {
                    const chordContainsNote =
                        chordMenuOptions?.chordNotes.includes(note as string)
                    return (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    id={toneNames[i]}
                                    color="default"
                                    disabled={
                                        chordContainsNote &&
                                        chordMenuOptions?.chordNotes.length ===
                                            1 &&
                                        !customMode
                                    }
                                    checked={
                                        (customMode &&
                                            indexArray.length > 0 &&
                                            indexArray[i]) ||
                                        (chordContainsNote && !customMode)
                                    }
                                    onChange={(e) =>
                                        customMode
                                            ? changeComponentInterval(i)
                                            : props.onChordNotesChange(
                                                  e.target.name,
                                                  e.target.checked
                                              )
                                    }
                                    name={note as string}
                                />
                            }
                            label={t<string>(`BottomBar.${toneNames[i]}`)}
                        />
                    )
                })}
            </FormGroup>
        </Box>
    )
}

export const MenuButtonWithAddIcon = (props: {
    text: string
    onClick?: () => void
    selected?: boolean
}) => {
    const styles = useStyles()
    return (
        <Button
            variant="outlined"
            size="large"
            className={styles.addbutton}
            disableFocusRipple
            style={{
                backgroundColor: props.selected
                    ? colors.gray_200
                    : colors.white,
            }}
            startIcon={<AddIcon />}
            onClick={() => props.onClick && props.onClick()}
        >
            <Typography>{props.text}</Typography>
        </Button>
    )
}

const customPopperPlacement = (props: PopperProps) => {
    return <Popper {...props} placement="top" children={props.children} />
}

export const DropdownAutocomplete = (props: {
    onChordChange: (chord: string) => void
    selectedChordType?: ChordType
    selectedChord?: string | null
}) => {
    const { selectedChordType, selectedChord, onChordChange } = props
    const styles = useStyles()
    const {
        state,
        optionData: { singleNoteOptions, chordOptions },
    } = useOptions()
    const dropdownOptions =
        selectedChordType === "CHORD" ? chordOptions : singleNoteOptions

    const { t } = useTranslation()
    console.log(selectedChord)
    useEffect(() => {
        if (
            dropdownOptions.length &&
            selectedChord &&
            !dropdownOptions.includes(selectedChord)
        ) {
            onChordChange(dropdownOptions[0])
        }
    }, [selectedChord, dropdownOptions, onChordChange])

    return (
        <Autocomplete<string>
            options={dropdownOptions}
            loading={state.loading}
            value={selectedChord}
            filterOptions={(options, selected) => {
                if (selectedChordType === "CHORD" && !selected.inputValue) {
                    // Chord list is too long to render on no input value
                    return commonChords
                }
                return options.filter((option) => {
                    return option.indexOf(selected.inputValue) === 0
                })
            }}
            onChange={(event, value) => {
                if (typeof value === "string") {
                    onChordChange(value)
                }
            }}
            blurOnSelect="touch"
            openText={t("BottomBar.open")}
            PopperComponent={customPopperPlacement}
            clearIcon={false}
            className={styles.dropdown}
            classes={{ popupIndicator: styles.icon }}
            noOptionsText={t("BottomBar.noOptions")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    hiddenLabel
                    inputProps={{
                        ...params.inputProps,
                        "aria-label": t(
                            `BottomBar.${
                                selectedChordType === "NOTE"
                                    ? "noteLabel"
                                    : "chordLabel"
                            }`
                        ),
                    }}
                    InputProps={{
                        ...params.InputProps,
                        className: styles.dropdown,
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
                            {selectedChordType === ChordType.NOTE ? (
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
