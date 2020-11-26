import React, { useState, useEffect } from "react"
import {
    Backdrop,
    Button,
    Fade,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import { theme } from "../../theme"

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
    container: {
        width: "100%",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
})

const CHARACTER_LIMIT = 250

export const TransposeModal = (props: {
    defaultValue?: string
    modalOpen: boolean
    handleClosed: () => void
    handleOnCancelClick: () => void
    handleOnSaveClick: (title: string, transpose: string) => void
    headerText: string
    labelText: string
    saveText: string
    cancelText: string
}) => {
    const classes = useStyles()
    const [titleInput, setTitleInput] = useState("")
    const [transposeInput, setTransposeInput] = useState("")
    const { t } = useTranslation()

    useEffect(() => {
        if (props.defaultValue) {
            setTitleInput(props.defaultValue)
        }
    }, [props.defaultValue])

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
                    <Grid container>
                        <Typography className={classes.title} variant="h2">
                            {props.headerText}
                        </Typography>
                        <Grid item className={classes.insertName} xs={12}>
                            <TextField
                                inputProps={{ maxLength: CHARACTER_LIMIT }}
                                helperText={`${titleInput.length}/${CHARACTER_LIMIT}`}
                                defaultValue={props.defaultValue}
                                autoFocus
                                value={titleInput}
                                variant="filled"
                                onChange={(e) => {
                                    setTitleInput(e.target.value)
                                }}
                                label={props.labelText}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="outlined"
                                className={classes.formControl}
                            >
                                <InputLabel id="demo-simple-select-outlined-label">
                                    {t("Modal:semiNotes")}
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={transposeInput}
                                    onChange={(
                                        e: React.ChangeEvent<{ value: any }>
                                    ) => {
                                        setTransposeInput(e.target.value)
                                    }}
                                    label="semiNotes"
                                >
                                    <MenuItem value={-6}>-6</MenuItem>
                                    <MenuItem value={-5}>-5</MenuItem>
                                    <MenuItem value={-4}>-4</MenuItem>
                                    <MenuItem value={-3}>-3</MenuItem>
                                    <MenuItem value={-2}>-2</MenuItem>
                                    <MenuItem value={-1}>-1</MenuItem>
                                    <MenuItem value={0}>0</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                className={classes.button}
                                size="large"
                                variant="contained"
                                disabled={!titleInput}
                                onClick={() =>
                                    props.handleOnSaveClick(
                                        titleInput,
                                        transposeInput
                                    )
                                }
                            >
                                {props.saveText}
                            </Button>
                            <Button
                                className={classes.button}
                                size="large"
                                variant="outlined"
                                onClick={() => {
                                    props.handleOnCancelClick()
                                    setTitleInput("")
                                }}
                            >
                                {props.cancelText}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}
