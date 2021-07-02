import React from "react"
import {
    FormControl,
    FormControlLabel,
    makeStyles,
    Radio,
    RadioGroup,
    RadioProps,
    Typography,
} from "@material-ui/core"
import { colors } from "../../utils/colors"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles({
    subtitle: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    radioButtonGroup: {
        color: colors.black,
        marginBottom: "24px",
        marginTop: "12px",
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
    checkedRadioButton: {
        backgroundColor: colors.gray_500,
        backgroundImage:
            "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
        borderRadius: "50%",
        "&:before": {
            display: "block",
            width: 16,
            height: 16,
            backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
            content: '""',
        },
    },
    focusedRadioButton: {
        boxShadow: `0 0 0 3px ${colors.focus}`,
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

    const StyledRadio = function (props: RadioProps) {
        const classes = useStyles()

        return (
            <Radio
                className={classes.root}
                disableFocusRipple
                color="default"
                checkedIcon={<span className={classes.checkedRadioButton} />}
                icon={<span className={classes.radioButton} />}
                focusVisibleClassName={classes.focusedRadioButton}
                {...props}
            />
        )
    }

    return (
        <div className={classes.radioButtonGroup}>
            <Typography className={classes.subtitle}>
                {radioButtonLabel}
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    aria-label={radioButtonLabel}
                    name="radiobuttons"
                    value={radioButtonValue}
                    onChange={handleChange}
                >
                    {radioButtonOptions.map((option) => (
                        <FormControlLabel
                            value={option}
                            checked={option === radioButtonValue}
                            control={<StyledRadio />}
                            label={t(option)}
                            aria-label={t(option)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    )
}
