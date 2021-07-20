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
import { useHistory } from "react-router"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"
import { AccordionComponent } from "../../components/AdminViewComponents/AccordionComponent.component"
import AddIcon from "@material-ui/icons/Add"
import EditIcon from "@material-ui/icons/Edit"
import { colors } from "../../utils/colors"
import { InviteUserToSystemDialog } from "../../components/CustomDialog/InviteUserToSystemDialog.components"
import { AddOrganisationDialog } from "../../components/CustomDialog/AddOrganisationDialog.component"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { IUser } from "../../models/IUser"
import { EditAdminsDialog } from "../../components/CustomDialog/EditAdminsDialog.component"
import {
    OrganisationFilter,
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
})

export const AdminView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const history = useHistory()

    const { getUser, userInit } = useGetUser()
    const userId = userInit?.userId
    const userIsSystemAdmin = () => {
        return true
        //return userInit ? userInit?.isSystemAdmin : false
    }

    const {
        getOrganisations: getAdminOrganisations,
        organisationsFetched: adminOrganisationsFetched,
    } = useGetOrganisations(
        userIsSystemAdmin() ? OrganisationFilter.All : OrganisationFilter.Admin
    )

    const {
        getOrganisations: getGroupAdminOrganisations,
        organisationsFetched: groupAdminOrganisationsFetched,
    } = useGetOrganisations(OrganisationFilter.GroupAdmin)

    const [inviteUserDialogIsOpen, setInviteUserDialogIsOpen] = useState(false)
    const [addOrganisationIsOpen, setAddOrganisationIsOpen] = useState(false)
    const [addGroupIsOpen, setAddGroupIsOpen] = useState(false)
    const [editSysAdminsDialogIsOpen, setEditSysAdminsDialogIsOpen] =
        useState(false)

    const renderedAdminOrganisationIds: number[] = []

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/library`)
    }

    const userIsOrganisationAdmin = () => {
        return (
            (adminOrganisationsFetched
                ? adminOrganisationsFetched?.length > 0
                : false) || userIsSystemAdmin()
        )
    }

    const userIsGroupAdmin = () => {
        return (
            (groupAdminOrganisationsFetched
                ? groupAdminOrganisationsFetched?.length > 0
                : false) || userIsOrganisationAdmin()
        )
    }

    const handleInviteUserDialogClose = () => {
        setInviteUserDialogIsOpen(false)
    }
    const handleInviteUserDialogSave = () => {
        //Inviter bruker
    }

    const handleAddOrganisationDialogClose = () => {
        setAddOrganisationIsOpen(false)
    }
    const handleAddOrganisationDialogSave = () => {
        //Legg til Land
    }

    const handleAddGroupDialogClose = () => {
        setAddGroupIsOpen(false)
    }
    const handleAddGroupDialogSave = () => {
        //Legg til Land
    }

    const handleEditSysAdminsDialogClose = () => {
        setEditSysAdminsDialogIsOpen(false)
    }
    const handleEditSysAdminsDialogSave = () => {
        //??
    }

    return (
        <>
            <Box mx={2}>
                <Grid container justify="center" className={classes.container}>
                    <Grid item xs={12}>
                        <Box mb={4}>
                            <DashboardTopBar
                                onChange={handleOnChangeSearch}
                                searchTerm={searchTerm}
                            />
                        </Box>
                    </Grid>
                    <Grid container spacing={3} item xs={12} sm={10}>
                        <Grid item xs={12}>
                            <Typography variant="h1">
                                {t("AdminView.adminPanel")}
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
                                disabled={!userIsGroupAdmin()}
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
                                    setAddOrganisationIsOpen(true)
                                }}
                                startIcon={<AddIcon />}
                                disabled={!userIsSystemAdmin()}
                            >
                                {t("AdminView.addCountry")}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setEditSysAdminsDialogIsOpen(true)
                                }}
                                startIcon={<EditIcon />}
                                disabled={!userIsSystemAdmin()}
                            >
                                {t("AdminView.editAdmins")}
                            </Button>
                        </Grid>
                        {userIsOrganisationAdmin()
                            ? adminOrganisationsFetched?.map((organisation) => {
                                  renderedAdminOrganisationIds.push(
                                      organisation.organisationId
                                  )
                                  return (
                                      <Grid item xs={12}>
                                          <AccordionComponent
                                              organisationId={
                                                  organisation.organisationId
                                              }
                                              title={organisation.name}
                                              buttonsIsDisabled={false}
                                          />
                                      </Grid>
                                  )
                              })
                            : ""}
                        {userIsGroupAdmin()
                            ? groupAdminOrganisationsFetched?.map(
                                  (organisation) => {
                                      return organisation.organisationId in
                                          renderedAdminOrganisationIds ? (
                                          ""
                                      ) : (
                                          <Grid item xs={12}>
                                              <AccordionComponent
                                                  organisationId={
                                                      organisation.organisationId
                                                  }
                                                  title={organisation.name}
                                              />
                                          </Grid>
                                      )
                                  }
                              )
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
                            userIsSystemAdmin={userIsSystemAdmin()}
                        />
                    </Dialog>

                    <Dialog
                        open={addOrganisationIsOpen}
                        onClose={handleAddOrganisationDialogClose}
                        aria-labelledby={t("AdminView.addCountry")}
                    >
                        <AddOrganisationDialog
                            handleOnSaveClick={handleAddOrganisationDialogSave}
                            handleOnCancelClick={
                                handleAddOrganisationDialogClose
                            }
                        />
                    </Dialog>
                    <Dialog
                        open={editSysAdminsDialogIsOpen}
                        onClose={handleEditSysAdminsDialogClose}
                        aria-label={t("Dialog.editAdmins")}
                        maxWidth="xs"
                        fullWidth
                    >
                        <EditAdminsDialog
                            editSysAdmins
                            handleOnCloseClick={handleEditSysAdminsDialogClose}
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
