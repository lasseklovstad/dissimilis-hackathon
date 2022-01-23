import React from "react"
import { FormControl, FormControlLabel, FormLabel, RadioGroup } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { colors } from "../../utils/colors"
import { useTranslation } from "react-i18next"
import { theme } from "../../theme"
import { StyledRadio } from "./StyledRadio.component"

const useStyles = makeStyles({
    subtitle: {
        fontWeight: "bold",
        marginBottom: theme.spacing(1),
        color: colors.black,
    },
    radioButtonGroup: {
        color: colors.black,
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(2),
    },
    root: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    radioButton: {
        borderRadius: "50%",
        width: 16,
        height: 16,
        boxShadow: `inset 0 0 0 1px ${colors.gray_500}, inset 0 -1px 0 ${colors.gray_400}`,
        backgroundColor: colors.gray_100,
        backgroundImage: `linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))`,
        "input:hover ~ &": {
            backgroundColor: colors.gray_200,
        },
    },
})

export const RadioButtons = (props: {
    radioButtonLabel: string
    radioButtonOptions: string[]
    radioButtonValue: string
    handleChange: (event: {
        target: { value: React.SetStateAction<string> }
    }) => void
}) => {
    const {
        radioButtonLabel,
        radioButtonOptions,
        radioButtonValue,
        handleChange,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.radioButtonGroup}>
            <FormControl component="fieldset">
                <FormLabel
                    component="legend"
                    className={classes.subtitle}
                    focused={false}
                >
                    {radioButtonLabel}
                </FormLabel>
                <RadioGroup
                    aria-label={radioButtonLabel}
                    name="radiobuttons"
                    value={radioButtonValue}
                    onChange={handleChange}
                >
                    {radioButtonOptions.map((option) => (
                        <FormControlLabel
                            key={option}
                            value={option}
                            checked={option === radioButtonValue}
                            control={<StyledRadio />}
                            label={t<string>(option)}
                            aria-label={"Radio: " + t(option)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    )
}
