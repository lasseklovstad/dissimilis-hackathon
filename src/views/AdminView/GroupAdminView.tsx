import React, { useState } from "react"
import {
    Box,
    Button,
    Dialog,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useHistory, useParams } from "react-router"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import AddIcon from "@material-ui/icons/Add"
import { colors } from "../../utils/colors"
import { InviteUserToSystemDialog } from "../../components/CustomDialog/InviteUserToSystemDialog.components"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { IUser } from "../../models/IUser"
import { AccordionGroupComponent } from "../../components/AdminViewComponents/AccordionGroupComponent.component"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import { IGroup } from "../../models/IGroup"
import {
    GroupFilter,
    OrganisationFilter,
    useGetGroups,
    useGetGroupsInOrganisation,
    useGetOrganisation,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
    button: {
        backgroundColor: colors.white,
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
        "&:focus-within": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        width: "100%",
        height: "100%",
        justifyContent: "left",
        fontSize: "1rem",
        padding: "8px",
    },
    returnButton: {
        backgroundColor: colors.white,
        boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)",
        "&:focus-within": {
            boxShadow: `0 0 0 4px ${colors.focus}`,
        },
        height: "100%",
        justifyContent: "left",
        fontSize: "1rem",
        padding: "8px",
        paddingRight: "15px",
    },
})

export const GroupAdminView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const history = useHistory()
    const { organisationId } = useParams<{ organisationId: string }>()

    const { getUser, userInit } = useGetUser()
    const userId = userInit?.userId

    const { getOrganisation, organisationFetched } = useGetOrganisation(
        parseInt(organisationId)
    )

    const userIsSystemAdmin = () => {
        return userInit ? userInit?.isSystemAdmin : false
    }

    const userIsAdminInCurrentOrganisation = () => {
        return userInit && organisationFetched
            ? organisationFetched?.admins.filter((admin) => {
                  return admin.userId === userId
              })
            : false || userIsSystemAdmin()
    }

    const { getGroups, groupsFetched } = useGetGroupsInOrganisation(
        userIsAdminInCurrentOrganisation()
            ? GroupFilter.All
            : GroupFilter.Admin,
        parseInt(organisationId)
    )

    const [inviteUserDialogIsOpen, setInviteUserDialogIsOpen] = useState(false)
    const [addGroupIsOpen, setAddGroupIsOpen] = useState(false)

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/library`)
    }

    const userIsGroupAdmin = () => {
        return (
            (groupsFetched ? groupsFetched?.length > 0 : false) ||
            userIsAdminInCurrentOrganisation()
        )
    }

    const handleInviteUserDialogClose = () => {
        setInviteUserDialogIsOpen(false)
    }
    const handleInviteUserDialogSave = () => {
        //Inviter bruker
    }

    const handleAddGroupDialogClose = () => {
        setAddGroupIsOpen(false)
    }
    const handleAddGroupDialogSave = () => {
        //Legg til Gruppe
    }

    return (
        <>
            <Box mx={2}>
                <Grid container justify="center" className={classes.container}>
                    <Grid item xs={12}>
                        <Box mb={4}>
                            <DashboardTopBar />
                        </Box>
                    </Grid>
                    <Grid container spacing={3} item xs={10} sm={10}>
                        <Grid item xs={12}>
                            <Button
                                disableFocusRipple
                                onClick={() => history.push(`/admin`)}
                                className={classes.returnButton}
                                startIcon={<ArrowBackIosIcon />}
                            >
                                {t("AdminView.backToAdminpanel")}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h1">
                                {organisationId + "-" + t("AdminView.groups")}
                            </Typography>
                        </Grid>
                        {/**
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setInviteUserDialogIsOpen(true)
                                }}
                                startIcon={<AddIcon />}
                            >
                                {t("AdminView.inviteUser")}
                            </Button>
                        </Grid>
                         */}
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setAddGroupIsOpen(true)
                                }}
                                startIcon={<AddIcon />}
                            >
                                {t("AdminView.addGroup")}
                            </Button>
                        </Grid>
                        {userIsGroupAdmin()
                            ? groupsFetched?.map((group) => {
                                  return (
                                      <Grid item xs={12}>
                                          <AccordionGroupComponent
                                              title={group.name}
                                              groupId={group.groupId}
                                          />
                                      </Grid>
                                  )
                              })
                            : ""}
                    </Grid>

                    <Dialog
                        open={inviteUserDialogIsOpen}
                        onClose={handleInviteUserDialogClose}
                        aria-labelledby={t("AdminView.inviteUser")}
                    >
                        <InviteUserToSystemDialog
                            handleOnSaveClick={handleInviteUserDialogSave}
                            handleOnCancelClick={handleInviteUserDialogClose}
                            defaultOrganisationId={
                                organisationFetched?.organisationId
                            }
                            userIsSystemAdmin={userIsSystemAdmin()}
                        />
                    </Dialog>

                    <Dialog
                        open={addGroupIsOpen}
                        onClose={handleAddGroupDialogClose}
                        aria-labelledby={t("AdminView.addGroup")}
                    >
                        <AddGroupDialog
                            handleOnSaveClick={handleAddGroupDialogSave}
                            handleOnCancelClick={handleAddGroupDialogClose}
                            listOfOrganisations={[]}
                            userList={[]}
                            defaultOrganisation={organisationFetched}
                        />
                    </Dialog>

                    <Typography variant="h2">
                        {!userIsGroupAdmin()
                            ? "You do not have permissions to view this page"
                            : ""}
                    </Typography>
                    <ErrorDialog
                        error={getUser.error}
                        isError={getUser.isError}
                        title="There was an error fetching the user access level"
                    />
                </Grid>
            </Box>
        </>
    )
}
