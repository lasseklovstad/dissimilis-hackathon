import React, { useEffect, useState } from "react"
import {
    Backdrop,
    Button,
    CircularProgress,
    Fade,
    FormControl,
    FormControlLabel,
    Grid,
    makeStyles,
    Modal,
    Radio,
    RadioGroup,
    RadioProps,
    TextField,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"

import { useTranslation } from "react-i18next"

const useStyles = makeStyles({
    modal: {
        position: "absolute",
        boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
        height: "auto",
        borderRadius: 2,
        backgroundColor: "white",
        padding: "40px",
        "@media (max-width: 600px)": {
            width: "80%",
            padding: "48px",
        },
        outline: "none",
    },
    insertName: {
        marginBottom: "24px",
        marginTop: "12px",
    },
    button: {
        "&:hover": {
            backgroundColor: colors.gray_300,
        },
        marginRight: "8px",
        float: "left",
        position: "relative",
    },
    title: {
        marginBottom: "8px",
    },
    subtitle: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    container: {
        width: "100%",
    },
    loading: {
        margin: "8px",
        marginRight: "16px",
        justifyContent: "center",
        alignContent: "center",
        minWidth: "64px",
        maxWidth: "64px",
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

export const InputAndRadioButtonModal = (props: {
    defaultValue?: string
    handleOnSaveClick: (value: string, option: string) => void
    handleOnCancelClick: () => void
    modalOpen: boolean
    handleClosed: () => void
    saveText: string
    cancelText: string
    headerText: string
    labelText: string
    radioButtonLabel: string
    radioButtonOptions: string[]
    characterLimit?: number
    isLoading?: boolean
    children?: any
}) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [textFieldInput, setTextFieldInput] = useState("")

    const CHARACTER_LIMIT =
        props.characterLimit === undefined ? 250 : props.characterLimit

    useEffect(() => {
        if (props.defaultValue) {
            setTextFieldInput(props.defaultValue)
        }
    }, [props.defaultValue])

    const [radioButtonValue, setRadioButtonValue] = React.useState(
        props.radioButtonOptions[0]
    )

    const handleChange = (event: {
        target: { value: React.SetStateAction<string> }
    }) => {
        setRadioButtonValue(event.target.value)
    }

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
        <Modal
            open={props.modalOpen}
            onClose={() => props.handleClosed()}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}
        >
            <Fade in={props.modalOpen}>
                <div
                    className={classes.modal}
                    style={{
                        top: "20%",
                        left: `50%`,
                        transform: `translate(-50%)`,
                    }}
                >
                    <form
                        className={classes.container}
                        onSubmit={(event) => {
                            event.preventDefault()
                            props.handleOnSaveClick(
                                textFieldInput,
                                radioButtonValue
                            )
                        }}
                    >
                        <Grid container>
                            <Typography className={classes.title} variant="h2">
                                {props.headerText}
                            </Typography>
                            <Grid item className={classes.insertName} xs={12}>
                                <TextField
                                    id="input-modal-textfield"
                                    inputProps={{ maxLength: CHARACTER_LIMIT }}
                                    helperText={`${textFieldInput.length}/${CHARACTER_LIMIT}`}
                                    autoFocus
                                    value={textFieldInput}
                                    variant="filled"
                                    onChange={(e) => {
                                        setTextFieldInput(e.target.value)
                                    }}
                                    label={props.labelText}
                                    style={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div className={classes.radioButtonGroup}>
                                    <Typography className={classes.subtitle}>
                                        {props.radioButtonLabel}
                                    </Typography>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            aria-label={props.radioButtonLabel}
                                            name="radiobuttons"
                                            value={radioButtonValue}
                                            onChange={handleChange}
                                        >
                                            {props.radioButtonOptions.map(
                                                (option) => (
                                                    <FormControlLabel
                                                        value={option}
                                                        checked={
                                                            option ===
                                                            radioButtonValue
                                                        }
                                                        control={
                                                            <StyledRadio
                                                            //autoFocus={option===radioButtonValue}
                                                            />
                                                        }
                                                        label={t(option)}
                                                        aria-label={t(option)}
                                                    />
                                                )
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container>
                                    {props.isLoading ? (
                                        <Grid
                                            container
                                            className={classes.loading}
                                        >
                                            <CircularProgress size={24} />
                                        </Grid>
                                    ) : (
                                        <Grid item>
                                            <Button
                                                className={classes.button}
                                                size="large"
                                                variant="contained"
                                                disabled={
                                                    !textFieldInput.trim()
                                                }
                                                type="submit"
                                            >
                                                {props.saveText}
                                            </Button>
                                        </Grid>
                                    )}
                                    <Grid item>
                                        <Button
                                            className={classes.button}
                                            size="large"
                                            variant="outlined"
                                            onClick={() => {
                                                props.handleOnCancelClick()
                                                setTextFieldInput("")
                                            }}
                                        >
                                            {props.cancelText}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Fade>
        </Modal>
    )
}
