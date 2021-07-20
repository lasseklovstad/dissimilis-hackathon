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
import { IGroup } from "../../models/IGroup"
import { EditAdminsDialog } from "../CustomDialog/EditAdminsDialog.component"
import { EditGroupInfoDialog } from "../CustomDialog/EditGroupInfoDialog.component"
import { useGetGroup } from "../../utils/useApiServiceGroups"

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
    container: {
        display: "flex",
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

export const AccordionGroupComponent = (props: {
    groupId: number
    title: string
}) => {
    const { title, groupId } = props
    const classes = useStyles()
    const { t } = useTranslation()

    const [addMemberDialogIsOpen, setAddMemberDialogIsOpen] = useState(false)
    const { getGroup, groupFetched } = useGetGroup(groupId)

    const handleAddMemberClose = () => {
        setAddMemberDialogIsOpen(false)
    }

    const handleAddMember = () => {
        //Legg til medlem til gruppe
    }

    const [groupInfoDialogIsOpen, setGroupInfoDialogIsOpen] = useState(false)
    const [editAdminsDialogIsOpen, setEditAdminsDialogIsOpen] = useState(false)

    const handleOpenEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(true)
    }

    const handleCloseEditAdminsDialog = () => {
        setEditAdminsDialogIsOpen(false)
    }

    const handleOpenGroupInfoDialog = () => {
        setGroupInfoDialogIsOpen(true)
    }

    const handleCloseGroupInfoDialog = () => {
        setGroupInfoDialogIsOpen(false)
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
                            <Typography>{groupFetched?.notes}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                {t("AdminView.admin") + ": "}
                                {groupFetched?.admins[0].name || ""}
                                <br />
                                {t("AdminView.address") + ": "}
                                {groupFetched?.address || ""}
                                <br />
                                {t("AdminView.phoneNumber") + ": "}
                                {groupFetched?.phoneNumber || ""}
                                <br />
                                {t("AdminView.email") + ": "}
                                {groupFetched?.email || ""}
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
                                onClick={handleOpenGroupInfoDialog}
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
                            >
                                <div className={classes.buttonText}>
                                    {t("AdminView.seeAllSongs")}
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
                    userList={[]} // Not in sprint 5
                    title={t("AdminView.addMemberTo") + " " + title}
                    descriptionText={t("AdminView.emailNewGroupMember")}
                    saveText={t("AdminView.add")}
                />
            </Dialog>
            <Dialog
                open={groupInfoDialogIsOpen}
                onClose={handleCloseGroupInfoDialog}
                aria-label={t("Dialog.groupInfo")}
            >
                <EditGroupInfoDialog
                    groupId={groupId}
                    group={groupFetched}
                    handleOnSaveClick={handleCloseGroupInfoDialog}
                    handleOnCancelClick={handleCloseGroupInfoDialog}
                    isGroup
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
                    groupId={groupId}
                    group={groupFetched}
                    handleOnCloseClick={handleCloseEditAdminsDialog}
                />
            </Dialog>
        </div>
    )
}
