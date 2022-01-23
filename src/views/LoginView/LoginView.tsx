import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { Collapse, useMediaQuery } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router"
import Alert from "@material-ui/lab/Alert"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import { useLoginPost, useLoginRedirect } from "../../utils/useApiServiceLogin"
import { colors } from "../../utils/colors"
import { ReactComponent as LoginLogo } from "../../assets/images/LoginLogo.svg"
import { ReactComponent as BackgroundImage } from "../../assets/images/butterflyGreen.svg"
import { ReactComponent as MicrosoftLogoIcon } from "../../assets/images/MicrosoftLogo.svg"

const useStyles = makeStyles({
    root: {
        justifyContent: "center",
    },
    container: {
        boxShadow: "0 3px 6px 2px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: colors.gray_100,
        marginTop: "10vh",
        zIndex: 2,
    },
    paddingsmall: {
        padding: "40px",
        marginBottom: "4vh",
    },
    paddinglarge: {
        padding: "48px",
    },
    loginlogo: {
        marginBottom: "40px",
        width: "60%",
    },
    loginbutton: {
        marginBottom: "16px",
        lineHeight: "24px",
        textTransform: "none",
        "& .MuiButton-startIcon": {
            marginRight: "12px",
        },
    },
    backgroundimage: {
        position: "absolute",
        zIndex: 1,
        width: "50%",
        height: "50%",
        left: 0,
    },
})

export const LoginView = () => {
    const classes = useStyles()

    const [isLoading, setIsLoading] = useState(false)
    const [warningDisplayed, setWarningDisplayed] = React.useState(false)

    const { t } = useTranslation()
    const matches = useMediaQuery("(min-width:600px)")
    const history = useHistory()
    const axiosGet = useLoginRedirect()

    const url = new URLSearchParams(window.location.search)
    const code = url.get("code") ? url.get("code") : null

    const axiosPost = useLoginPost(code)

    const tryLogin = () => {
        axiosGet().then(({ result }) => {
            if (result) {
                window.location.href = result.headers.location
            }
        })
    }
    useEffect(() => {
        if (
            sessionStorage.getItem("apiKey") &&
            sessionStorage.getItem("userId")
        ) {
            history.replace("/dashboard")
        } else if (code !== null) {
            setIsLoading(true)
            axiosPost().then(({ result }) => {
                if (result && result.status === 200) {
                    sessionStorage.setItem("apiKey", result.data.apiKey)
                    sessionStorage.setItem(
                        "userId",
                        result.data.userID?.toString()
                    )
                    history.replace("/dashboard")
                }
            })
        }
    }, [history, axiosPost, code])

    const warning = (
        <Collapse in={warningDisplayed}>
            <Alert
                severity="warning"
                action={
                    <IconButton
                        size="small"
                        onClick={() => {
                            setWarningDisplayed(false)
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            >
                {t("LoginView.loginFailed")}
            </Alert>
        </Collapse>
    )

    return (
        <Grid container className={classes.root}>
            <BackgroundImage
                className={classes.backgroundimage}
                style={{ display: isLoading ? "none" : "block" }}
            />
            {isLoading ? (
                <Grid
                    item
                    xs={10}
                    sm={6}
                    md={4}
                    xl={2}
                    style={{ boxShadow: "none" }}
                    className={
                        matches
                            ? `${classes.container} ${classes.paddinglarge}`
                            : `${classes.container} ${classes.paddingsmall}`
                    }
                >
                    <LoginLogo />
                </Grid>
            ) : (
                <Grid
                    item
                    xs={10}
                    sm={6}
                    md={4}
                    xl={2}
                    className={
                        matches
                            ? `${classes.container} ${classes.paddinglarge}`
                            : `${classes.container} ${classes.paddingsmall}`
                    }
                >
                    <LoginLogo className={classes.loginlogo} />
                    <Button
                        size="large"
                        className={classes.loginbutton}
                        fullWidth
                        variant="outlined"
                        onClick={tryLogin}
                        disableFocusRipple
                        startIcon={<MicrosoftLogoIcon />}
                    >
                        {t("LoginView.loginWithMicrosoft")}
                    </Button>
                    {warning}
                </Grid>
            )}
        </Grid>
    )
}
