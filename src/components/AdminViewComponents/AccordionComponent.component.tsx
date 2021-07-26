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
import { UserAutoCompleteDialog } from "../../components/CustomDialog/UserAutoCompleteDialog.component"
import { useHistory } from "react-router"
import { EditGroupInfoDialog } from "../CustomDialog/EditGroupInfoDialog.component"
import { EditAdminsDialog } from "../CustomDialog/EditAdminsDialog.component"
import {
    useDeleteOrganisation,
    useGetOrganisation,
    useAddOrganisationMember,
    useRemoveOrganisationMember,
    useUpdateOrganisation,
} from "../../utils/useApiServiceGroups"
import { ChoiceDialog } from "../CustomDialog/ChoiceDialog.component"
import { IUser } from "../../models/IUser"

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
    deleteButton: {
        backgroundColor: colors.gray_300,
        "&:hover": {
            backgroundColor: colors.gray_400,
        },
    },
})

export const AccordionComponent = (props: {
    organisationId: number
    title: string
    userIsSysAdm: boolean
    buttonsIsDisabled?: boolean
    removeOrganisation: (organisationId: number) => void
}) => {
    const {
        title,
        organisationId,
        buttonsIsDisabled = true,
        userIsSysAdm,
        removeOrganisation,
    } = props
    const classes = useStyles()
    const { t } = useTranslation()

    const { organisationFetched } = useGetOrganisation(organisationId)
    const { deleteOrganisation } = useDeleteOrganisation(organisationId)
    const { addOrganisationMember } = useAddOrganisationMember(organisationId)
    const { updateOrganisation } = useUpdateOrganisation(organisationId)

    const [organisationInfoDialogIsOpen, setOrganisationInfoDialogIsOpen] =
        useState(false)
    const [editAdminsDialogIsOpen, setEditAdminsDialogIsOpen] = useState(false)
    const [deleteCountryDialogIsOpen, setDeleteCountryDialogIsOpen] =
        useState(false)

    const handleOpenEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(true)
    }

    const handleCloseEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(false)
    }

    const handleOpenOrganisationInfoDialog = () => {
        setOrganisationInfoDialogIsOpen(true)
    }

    const handleCloseOrganisationInfoDialog = () => {
        setOrganisationInfoDialogIsOpen(false)
    }

    const history = useHistory()

    const [addMemberDialogIsOpen, setAddMemberDialogIsOpen] = useState(false)

    const handleAddMemberClose = () => {
        setAddMemberDialogIsOpen(false)
    }

    const handleAddMember = async (user: IUser | undefined) => {
        if (user) {
            const { error, result } = await addOrganisationMember.run({
                newMemberUserId: user.userId,
                newMemberRole: 10, // 10=member, 20=admin
            })
            if (!error && result) {
                setAddMemberDialogIsOpen(false)
            }
        } else {
            // User does not exist
            // handle this
        }
    }

    const handleDeleteCountryDialogClose = () => {
        setDeleteCountryDialogIsOpen(false)
    }

    const handleDeleteCountry = async () => {
        const { error, result } = await deleteOrganisation.run()
        if (!error && result) {
            removeOrganisation(organisationId)
        }
    }

    const handleUpdateDetails = async (
        name: string,
        address: string,
        emailAddress: string,
        description: string,
        phoneNumber: string
    ) => {
        const { error, result } = await updateOrganisation.run({
            address,
            emailAddress,
            description,
            phoneNumber,
        })

        if (!error && result) {
            handleCloseOrganisationInfoDialog()
        }
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
                            <Typography>
                                {organisationFetched?.notes}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {t("AdminView.admin") + ": "}
                                {organisationFetched?.admins
                                    ? organisationFetched?.admins[0].name
                                    : ""}
                                <br />
                                {t("AdminView.address") + ": "}
                                {organisationFetched?.address || ""}
                                <br />
                                {t("AdminView.phoneNumber") + ": "}
                                {organisationFetched?.phoneNumber || ""}
                                <br />
                                {t("AdminView.email") + ": "}
                                {organisationFetched?.email || ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                disabled={buttonsIsDisabled}
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
                                disabled={buttonsIsDisabled}
                                className={classes.button}
                                onClick={handleOpenOrganisationInfoDialog}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.editInfo")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                disabled={buttonsIsDisabled}
                                className={classes.button}
                                onClick={() =>
                                    history.push(
                                        `/admin/organisation/${organisationId}`
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
                                disabled={buttonsIsDisabled}
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
                                disabled={buttonsIsDisabled}
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
                                disabled={buttonsIsDisabled}
                                className={classes.button}
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllSongs")}
                                </div>
                            </Button>
                        </Grid>
                        {userIsSysAdm ? (
                            <>
                                {" "}
                                <Grid item sm={8} />
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        disableFocusRipple
                                        className={
                                            classes.button +
                                            " " +
                                            classes.deleteButton
                                        }
                                        onClick={() => {
                                            setDeleteCountryDialogIsOpen(true)
                                        }}
                                    >
                                        <div className={classes.buttonText}>
                                            {t("AdminView.deleteCountry")}
                                        </div>
                                    </Button>
                                </Grid>{" "}
                            </>
                        ) : (
                            ""
                        )}
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
                    userList={[]}
                    title={t("AdminView.addMemberTo") + " " + title}
                    descriptionText={t("AdminView.emailNewGroupMember")}
                    saveText={t("AdminView.add")}
                />
            </Dialog>
            <Dialog
                open={organisationInfoDialogIsOpen}
                onClose={handleCloseOrganisationInfoDialog}
                aria-label={t("Dialog.countryInfo")}
            >
                <EditGroupInfoDialog
                    groupId={organisationId}
                    group={organisationFetched}
                    handleOnSaveClick={handleUpdateDetails}
                    handleOnCancelClick={handleCloseOrganisationInfoDialog}
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
                    groupId={organisationId}
                    group={organisationFetched}
                    handleOnCloseClick={handleCloseEditAdminsDialog}
                />
            </Dialog>
            <Dialog
                open={deleteCountryDialogIsOpen}
                onClose={handleDeleteCountryDialogClose}
                aria-label={t("AdminView.deleteCountry")}
            >
                <ChoiceDialog
                    handleOnCancelClick={handleDeleteCountryDialogClose}
                    handleOnSaveClick={handleDeleteCountry}
                    ackText={t("AdminView.deleteCountry")}
                    cancelText={t("Dialog.cancel")}
                    headerText={t("AdminView.deleteCountry")}
                    descriptionText={t("Dialog.deleteCountryDescription")}
                />
            </Dialog>
        </div>
    )
}
