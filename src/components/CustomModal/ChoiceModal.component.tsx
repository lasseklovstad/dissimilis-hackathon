import React from "react"
import {
    Backdrop,
    Box,
    Button,
    Fade,
    Grid,
    makeStyles,
    Modal,
    Typography,
} from "@material-ui/core"

import { colors } from "../../utils/colors"
import { LoadingLogo } from "../loadingLogo/LoadingLogo.component"

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
    paragraph: {
        marginBottom: "24px",
    },
    container: {
        width: "100%",
    },
})

export const ChoiceModal = (props: {
    handleOnCancelClick: () => void
    modalOpen: boolean
    handleClosed: () => void
    cancelText: string
    headerText: string
    descriptionText: string
    isLoading?: boolean
}) => {
    const classes = useStyles()

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
                        {props.isLoading ? (
                            <Grid item xs={12}>
                                <LoadingLogo />
                            </Grid>
                        ) : (
                            <Box>
                                <Grid item xs={12}>
                                    <Typography
                                        className={classes.title}
                                        variant="h2"
                                    >
                                        {props.headerText}
                                    </Typography>
                                    <Typography className={classes.paragraph}>
                                        {props.descriptionText}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        className={classes.button}
                                        size="large"
                                        variant="outlined"
                                        onClick={() =>
                                            props.handleOnCancelClick()
                                        }
                                    >
                                        {props.cancelText}
                                    </Button>
                                </Grid>
                            </Box>
                        )}
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}
