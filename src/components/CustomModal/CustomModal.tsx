import { FC, useState } from "react"
import { Modal, makeStyles, Grid, Typography, TextField, Button, Fade, Backdrop } from "@material-ui/core"
import React from "react"
import { colors } from "../../utils/colors"

type CustomModalProps = {
    handleOnSaveClick: Function,
    handleOnCancelClick: Function,
    handleChange: Function,
    modalOpen: boolean,
    handleClosed: Function,
    saveText: string,
    cancelText: string,
    headerText: string,
    labelText: string,
}

export const CustomModal: FC<CustomModalProps> = (props) => {
    const classes = useStyles();
    const [textFieldInput, setTextFieldInput] = useState("");
    const [modalStyle] = useState(getModalStyle);

    const CHARACTER_LIMIT = 250;

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
        setTextFieldInput(e.target.value);
        props.handleChange(e);

    }

    return (
        <Modal open={props.modalOpen} onClose={props.handleClosed()}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 240,
            }}>
            <Fade in={props.modalOpen} >
                <div className={classes.modal} style={modalStyle}>
                    <Grid container >
                        <Typography className={classes.title} variant="h2">{props.headerText}</Typography>
                        <Grid item xs={12} style={{ marginBottom: "16px" }}>
                            <TextField inputProps={{ maxLength: CHARACTER_LIMIT }} helperText={`${textFieldInput.length}/${CHARACTER_LIMIT}`} autoFocus variant="filled" onChange={handleChange} label={props.labelText} style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button className={classes.button} size="large" variant="contained" disabled={!textFieldInput} onClick={props.handleOnSaveClick()} >{props.saveText}</Button>
                            <Button className={classes.button} size="large" variant="outlined" onClick={props.handleOnCancelClick()}>{props.cancelText}</Button>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal >
    )
}

function getModalStyle() {
    const left = 50;

    return {
        top: "20%",
        left: `${left}%`,
        transform: `translate(-${left}%)`,
    };
}

const useStyles = makeStyles({
    modal: {
        position: 'absolute',
        boxShadow: '0 3px 6px 2px rgba(0, 0, 0, 0.1)',
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
    button: {
        "&:hover": {
            backgroundColor: colors.gray_300
        },
        marginRight: "8px",
        float: "left",
        position: "relative",
    },
    title: {
        padding: "8px",
    },
    container: {
        width: "100%"
    }
})



