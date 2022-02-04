import { Box, Grid, Popper, PopperProps, TextField } from "@mui/material"
import React from "react"
import { useChordMenuOptionsContext } from "../../context/chordMenuOptions/ChordMenuOptionsContextProvider.component"
import { useUpdateSelectedChord } from "../../context/selectedChord/useUpdateSelectedChord"
import { useOptions } from "../../utils/useApiServiceGlobalNote.util"
import { useTranslation } from "react-i18next"
import Autocomplete from "@mui/material/Autocomplete"
import { commonChords } from "../../models/commonChords"
import Typography from "@mui/material/Typography"
import { ChordType } from "../../models/IChordMenuOptions"
import { getColor, tangentToNumber } from "../../utils/bar.util"
import { colors } from "../../utils/colors"

const customPopperPlacement = (props: PopperProps) => {
    return <Popper {...props} placement="top" children={props.children} />
}
export const ChordNameAutocomplete = () => {
    const { chordMenuOptions, setChordMenuOptions } =
        useChordMenuOptionsContext()
    const { updateSelectedChord } = useUpdateSelectedChord()
    const {
        state,
        optionData: { singleNoteOptions, chordOptions },
    } = useOptions()
    const dropdownOptions =
        chordMenuOptions.chordType === "CHORD"
            ? chordOptions
            : singleNoteOptions

    const { t } = useTranslation()

    const handleUpdateChord = async (chord: string) => {
        const newOptions = {
            ...chordMenuOptions,
            chord,
        }
        await updateSelectedChord(newOptions)
        setChordMenuOptions(newOptions)
    }
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
                    handleUpdateChord(value)
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
