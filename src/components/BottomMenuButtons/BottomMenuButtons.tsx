import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import {
    Box,
    Button,
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
})

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
    notesOrChords: string[]
    noOptionsText: string
    noteIsSelected: boolean
    selectedChord: string
    onChordChange: (chord: string) => void
}) => {
    const {
        noteIsSelected,
        selectedChord,
        onChordChange,
        notesOrChords,
    } = props
    const styles = useStyles()

    const showValue = selectedChord
    if (!notesOrChords.includes(selectedChord)) {
        onChordChange(notesOrChords[0])
    }
    const { t } = useTranslation()

    return (
        <Autocomplete<string>
            options={notesOrChords}
            value={showValue}
            filterOptions={filterOptions}
            onChange={(event, value) => {
                if (typeof value === "string") {
                    onChordChange(value)
                }
            }}
            openText={t("BottomBar:open")}
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
                <>
                    <Grid container>
                        <Grid item xs={9}>
                            <Typography>{options}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            {noteIsSelected ? (
                                <Box
                                    style={{
                                        height: "24px",
                                        width: "24px",
                                        backgroundColor: getColor(options, false),
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
                </>
            )}
        />
    )
}
