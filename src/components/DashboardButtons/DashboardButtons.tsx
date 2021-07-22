import React, { FC } from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import {
    Box,
    Button,
    Card,
    CardActionArea,
    Grid,
    Icon,
    IconButton,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore"
import ExpandLess from "@material-ui/icons/ExpandLess"
import { useTranslation } from "react-i18next"
import { colors } from "../../utils/colors"
import butterflyBlue from "../../assets/images/butterflyBlue.svg"
import { SongGridMenuButton } from "../SongGridMenuButton/SongGridMenuButton.component"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
    },
    button: {
        backgroundColor: colors.white,
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
    },
    newSongButton: {
        "&:focus-within": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
    },
    songButton: {
        border: `4px solid ${colors.white}`,
        "&:focus": {
            border: `4px solid ${colors.focus}`,
            "&:hover": {
                border: `4px solid ${colors.focus}`,
            },
        },
        "&:hover": {
            border: `4px solid ${colors.hover_background}`,
            backgroundColor: `${colors.hover_background}`,
        },
    },
    buttonGreen: {
        backgroundColor: colors.teal_100,
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
    },
    butterflyButtonContainer: {
        maxHeight: "48px",
        maxWidth: "48px",
        backgroundColor: colors.white,
    },
    butterflyButtonCard: {
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
    },
    butterflyButtonCardIcon: {
        padding: "8px",
        borderRadius: "1px",
    },
    songContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
    },
    songScalableText: {
        [theme.breakpoints.up("xs")]: {
            fontSize: "0.725rem",
        },
        [theme.breakpoints.up("sm")]: {
            fontSize: "1rem",
        },
    },
    breakableText: {
        marginRight: 8,
        overflowWrap: "break-word",
    },
}))

export type ButtonProps = {
    text: string
    link: string
    func?: () => void
    selected?: boolean
    onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

type ButtonSongProps = {
    title: string
    arrangerEmail?: string | null
    updatedOn?: string
    songId: number
    removeSong: (songId: number) => void
    renameSong: (songId: number, title: string) => void
    link: string
    func?: () => void
    selected?: boolean
    onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

type ButtonNoLinkProps = {
    text: string
    func: () => void
    color?: string
    selected?: boolean
}

type SortingButtonsProps = {
    orderTerm: string
    changeOrderTerm: (term: "date" | "song" | "user") => void
    orderDescending: boolean
    groupId: string
    organisationId: string
}

export const DashboardButtonWithAddIconNoLink: FC<ButtonNoLinkProps> = (
    props
) => {
    const styles = useStyles()
    return (
        <Card className={`${styles.button} ${styles.newSongButton}`}>
            <CardActionArea
                onClick={() => props.func && props.func()}
                disableRipple
            >
                <Box className={styles.container} py={2} pl={1}>
                    <AddIcon />
                    <Box pl={1} pr={2}>
                        <Typography>{props.text}</Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export const DashboardButtonSearch: FC<ButtonNoLinkProps> = (props) => {
    const styles = useStyles()
    return (
        <Card className={`${styles.button} ${styles.newSongButton}`}>
            <CardActionArea
                onClick={() => props.func && props.func()}
                disableRipple
            >
                <Box className={styles.container} py={2} pl={1}>
                    <Box pl={1} pr={2}>
                        <Typography>{props.text}</Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export const SortingButtons: FC<SortingButtonsProps> = (props) => {
    const { orderTerm, changeOrderTerm, orderDescending } = props
    const styles = useStyles()
    const { t } = useTranslation()

    return (
        <Box style={{ width: "100%" }}>
            <Grid
                container
                alignItems="center"
                className={styles.songContainer}
                style={{ paddingRight: 80, paddingLeft: 12 }}
            >
                <Grid item xs={4}>
                    <Button
                        disableFocusRipple
                        endIcon={
                            orderTerm === "song" ? (
                                orderDescending ? (
                                    <ExpandMoreIcon />
                                ) : (
                                    <ExpandLess />
                                )
                            ) : (
                                <UnfoldMoreIcon />
                            )
                        }
                        onClick={() => changeOrderTerm("song")}
                    >
                        {t("DashboardView.song")}
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <Button
                        disableFocusRipple
                        endIcon={
                            orderTerm === "user" ? (
                                orderDescending ? (
                                    <ExpandMoreIcon />
                                ) : (
                                    <ExpandLess />
                                )
                            ) : (
                                <UnfoldMoreIcon />
                            )
                        }
                        onClick={() => changeOrderTerm("user")}
                    >
                        {t("DashboardView.user")}
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <Button
                        disableFocusRipple
                        endIcon={
                            orderTerm === "date" ? (
                                orderDescending ? (
                                    <ExpandMoreIcon />
                                ) : (
                                    <ExpandLess />
                                )
                            ) : (
                                <UnfoldMoreIcon />
                            )
                        }
                        onClick={() => changeOrderTerm("date")}
                    >
                        {t("DashboardView.date")}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

const convertToDate = (time: number) => {
    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
    } as Intl.DateTimeFormatOptions
    const date: Date = new Date()
    date.setTime(time)

    return `${date.toLocaleDateString("en-GB")}, ${date.toLocaleTimeString(
        "en-GB",
        timeOptions
    )}`
}

export const DashboardButton: FC<ButtonSongProps> = (props) => {
    const styles = useStyles()
    const { t } = useTranslation()
    return (
        <Card className={styles.button}>
            <Grid container className={styles.songContainer}>
                <Box flexGrow={1}>
                    <CardActionArea
                        to={props.link}
                        component={Link}
                        className={styles.songButton}
                    >
                        <Grid
                            container
                            alignItems="center"
                            onContextMenu={(e) =>
                                props.onContextMenu && props.onContextMenu(e)
                            }
                            className={styles.container}
                            style={{
                                backgroundColor:
                                    props.selected === true
                                        ? colors.gray_400
                                        : colors.white,
                                height: "100%",
                                padding: 16,
                            }}
                        >
                            <Grid item xs={12} sm={4}>
                                <Typography className={styles.breakableText}>
                                    {props.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography
                                    className={`${styles.songScalableText} ${styles.breakableText}`}
                                >
                                    {props.arrangerEmail}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography
                                    className={`${styles.songScalableText} ${styles.breakableText}`}
                                >
                                    {t("DashboardView.updatedOn")}{" "}
                                    {props.updatedOn
                                        ? convertToDate(
                                              Date.parse(props.updatedOn)
                                          )
                                        : ""}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardActionArea>
                </Box>
                <Box p={1}>
                    <SongGridMenuButton
                        songId={props.songId}
                        link={props.link}
                        removeSong={props.removeSong}
                        renameSong={props.renameSong}
                    />
                </Box>
            </Grid>
        </Card>
    )
}

export const DashboardLibraryButton: FC<ButtonProps> = ({ text, link }) => {
    const styles = useStyles()
    return (
        <Box>
            <Card className={`${styles.buttonGreen} ${styles.newSongButton}`}>
                <CardActionArea to={link} component={Link}>
                    <Box className={styles.container}>
                        <Box p={2}>
                            <Typography>{text}</Typography>
                        </Box>
                    </Box>
                </CardActionArea>
            </Card>
        </Box>
    )
}

export const DashboardTopBarIcon = (props: { onGoHome?: () => void }) => {
    const { t } = useTranslation()
    const altProp = t("DashboardView.altButterflyButtonProp")
    const ariaProp = t("DashboardView.ariaButterflyButtonProp")
    const { onGoHome } = props
    return (
        <IconButton
            disableFocusRipple
            component={Link}
            to="/dashboard"
            onClick={onGoHome}
            aria-label={ariaProp}
        >
            <Icon fontSize="large">
                <img src={butterflyBlue} alt={altProp} />
            </Icon>
        </IconButton>
    )
}
