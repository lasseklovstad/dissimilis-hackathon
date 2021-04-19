import React, { useContext } from "react"
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
import { SongContext } from "../../views/SongView/SongContextProvider.component"

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
    root: {
        display: "flex",
        justifyContent: "space-between",
        padding: "7px 8px",
        height: "auto",
    },
})

export const ChordOptions = (props: {
    chord: string
    onChordNotesChange: (clickedNote: string, checked: boolean) => void
}) => {
    const styles = useStyles()
    const { chordMenuOptions } = useContext(SongContext)
    const { t } = useTranslation()

    if (chordMenuOptions.chordType === ChordType.NOTE) {
        return <></>
    }

    const allNotes = getNotesFromChord(props.chord)
    return (
        <Box id="chordOptionsContainer" className={styles.root}>
            <FormGroup id="chordOptions" row>
                {allNotes.map((note, i) => {
                    const chordContainsNote = chordMenuOptions.chordNotes.includes(
                        note as string
                    )
                    return (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    id={toneNames[i]}
                                    color="default"
                                    disabled={
                                        chordContainsNote &&
                                        chordMenuOptions.chordNotes.length === 1
                                    }
                                    checked={chordContainsNote}
                                    onChange={(e) =>
                                        props.onChordNotesChange(
                                            e.target.name,
                                            e.target.checked
                                        )
                                    }
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
    return <Popper {...props} placement="top" />
}
const filterOptions = createFilterOptions<string>({ matchFrom: "start" })

export const DropdownAutocomplete = (props: {
    icon: React.ReactNode
    chordDropdownContent: string[]
    noOptionsText: string
    selectedChordType: ChordType
    selectedChord: string
    onChordChange: (chord: string) => void
}) => {
    const {
        selectedChordType,
        selectedChord,
        onChordChange,
        chordDropdownContent,
    } = props
    const styles = useStyles()

    const showValue = selectedChord
    if (!chordDropdownContent.includes(selectedChord)) {
        onChordChange(chordDropdownContent[0])
    }
    const { t } = useTranslation()

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
            noOptionsText={props.noOptionsText}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
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
                    <Grid item xs={3}>
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
