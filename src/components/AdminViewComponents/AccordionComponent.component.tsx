import React, { useState } from "react"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { colors } from "../../utils/colors"
import { useTranslation } from "react-i18next"
import { IUser } from "../../models/IUser"
import { UserAutoCompleteDialog } from "../../components/CustomDialog/UserAutoCompleteDialog.component"
import { useHistory } from "react-router"
import { EditGroupInfoDialog } from "../CustomDialog/EditGroupInfoDialog.component"
import { ICountry } from "../../models/ICountry"
import { EditAdminsDialog } from "../CustomDialog/EditAdminsDialog.component"

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    heading: {
        fontSize: "1.25rem",
        fontWeight: "bold",
    },
    accordion: {
        justifyContent: "center",
    },
    button: {
        backgroundColor: colors.teal_100,
        width: "100%",
        height: "100%",
        justifyContent: "left",
        fontSize: "1rem",
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
        "&:focus-within": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        "&:hover": {
            backgroundColor: colors.teal_200,
        },
    },
    buttonText: {
        paddingLeft: "8px",
    },
})

export const AccordionComponent = (props: {
    countryId: number
    country: ICountry // Temporary
    title: string
    users: IUser[]
}) => {
    const { title, users, countryId, country } = props
    const classes = useStyles()
    const { t } = useTranslation()
    const [countryInfoDialogIsOpen, setCountryInfoDialogIsOpen] =
        useState(false)
    const [editAdminsDialogIsOpen, setEditAdminsDialogIsOpen] = useState(false)

    const handleOpenEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(true)
    }

    const handleCloseEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(false)
    }

    const handleOpenCountryInfoDialog = () => {
        setCountryInfoDialogIsOpen(true)
    }

    const handleCloseCountryInfoDialog = () => {
        setCountryInfoDialogIsOpen(false)
    }

    const history = useHistory()

    const [addMemberDialogIsOpen, setAddMemberDialogIsOpen] = useState(false)

    const handleAddMemberClose = () => {
        setAddMemberDialogIsOpen(false)
    }

    const handleAddMember = () => {
        //Legg til medlem til gruppe
    }

    return (
        <div className={classes.root}>
            <Accordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography>{country.notes}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {t("AdminView.admin") + ": "}
                                {country.admins[0].name || ""}
                                <br />
                                {t("AdminView.address") + ": "}
                                {country.address || ""}
                                <br />
                                {t("AdminView.phoneNumber") + ": "}
                                {country.phoneNumber || ""}
                                <br />
                                {t("AdminView.email") + ": "}
                                {country.email || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllMembers")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={handleOpenCountryInfoDialog}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.editInfo")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() =>
                                    history.push(
                                        `/admin/country/${country.countryId}`
                                    )
                                }
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllGroups")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setAddMemberDialogIsOpen(true)
                                }}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.addMember")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={handleOpenEditAdminsDialog}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.editAdmins")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllSongs")}
                                </div>
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Dialog
                open={addMemberDialogIsOpen}
                onClose={handleAddMemberClose}
                aria-labelledby={t("AdminView.addMember")}
                maxWidth="sm"
                fullWidth
            >
                <UserAutoCompleteDialog
                    handleOnCancelClick={handleAddMemberClose}
                    handleOnSaveClick={handleAddMember}
                    userList={users}
                    title={t("AdminView.addMemberTo") + " " + title}
                    descriptionText={t("AdminView.emailNewGroupMember")}
                    saveText={t("AdminView.add")}
                />
            </Dialog>
            <Dialog
                open={countryInfoDialogIsOpen}
                onClose={handleCloseCountryInfoDialog}
                aria-label={t("Dialog.countryInfo")}
            >
                <EditGroupInfoDialog
                    groupId={countryId}
                    group={country}
                    handleOnSaveClick={handleCloseCountryInfoDialog}
                    handleOnCancelClick={handleCloseCountryInfoDialog}
                    isGroup={false}
                />
            </Dialog>
            <Dialog
                open={editAdminsDialogIsOpen}
                onClose={handleCloseEditAdminsDialog}
                aria-label={t("Dialog.editAdmins")}
                maxWidth="xs"
                fullWidth
            >
                <EditAdminsDialog
                    groupId={countryId}
                    group={country}
                    handleOnCloseClick={handleCloseEditAdminsDialog}
                />
            </Dialog>
        </div>
    )
}
