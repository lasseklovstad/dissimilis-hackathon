import { FC, useState } from "react"
import { Modal, makeStyles, Grid, Typography, Button, Fade, Backdrop } from "@material-ui/core"
import React from "react"
import { colors } from "../../utils/colors"

type ChoiceModalProps = {
    handleOnSaveClick: Function,
    handleOnCancelClick: Function,
    handleChange: Function,
    modalOpen: boolean,
    handleClosed: Function,
    ackText: string,
    cancelText: string,
    headerText: string,
    descriptionText: string,

}

export const ChoiceModal: FC<ChoiceModalProps> = (props) => {
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
                        <Grid item xs={12}>
                            <Typography className={classes.title} variant="h1">{props.headerText}</Typography>
                            <Typography className={classes.title} variant="h6">{props.descriptionText}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button className={classes.button} size="large" variant="contained" onClick={props.handleOnSaveClick()} >{props.ackText}</Button>
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



