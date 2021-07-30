import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
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
} from "@material-ui/core"
import Autocomplete, {
    createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { getColor, tangentToNumber } from "../../utils/bar.util"
import { ChordType } from "../../models/IChordMenuOptions"
import { getNotesFromChord, toneNames } from "../../models/chords"
import { useSongContext } from "../../views/SongView/SongContextProvider.component"

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
    const { alwaysShow, customMode = false, indexArray = [], changeComponentInterval= () => {} } = props
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
                                            1 && !customMode
                                    }
                                    checked={(customMode && indexArray.length > 0 && indexArray[i] ) || (chordContainsNote && !customMode)}
                                    onChange={(e) => customMode ? changeComponentInterval(i) : props.onChordNotesChange(e.target.name, e.target.checked)}
                                    name={note as string}
                                />
                            }
                            label={t(`BottomBar.${toneNames[i]}`)}
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
const filterOptions = createFilterOptions<string>({ matchFrom: "start" })

export const DropdownAutocomplete = (props: {
    icon: React.ReactNode
    chordDropdownContent: string[]
    noOptionsText: string
    onChordChange: (chord: string) => void
    selectedChordType?: ChordType
    selectedChord?: string | null
}) => {
    const {
        selectedChordType,
        selectedChord,
        onChordChange,
        chordDropdownContent,
    } = props
    const styles = useStyles()

    const showValue = selectedChord

    const { t } = useTranslation()

    useEffect(() => {
        if (selectedChord && !chordDropdownContent.includes(selectedChord)) {
            onChordChange(chordDropdownContent[0])
        }
    }, [selectedChord, chordDropdownContent, onChordChange])

    return (
        <Autocomplete<string>
            options={chordDropdownContent}
            value={showValue}
            filterOptions={filterOptions}
            onChange={(event, value) => {
                if (typeof value === "string") {
                    onChordChange(value)
                }
            }}
            blurOnSelect="touch"
            openText={t("BottomBar.open")}
            PopperComponent={customPopperPlacement}
            closeIcon={false}
            className={styles.dropdown}
            classes={{ popupIndicator: styles.icon }}
            noOptionsText={props.noOptionsText}
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
            renderOption={(options) => (
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
            )}
        />
    )
}
