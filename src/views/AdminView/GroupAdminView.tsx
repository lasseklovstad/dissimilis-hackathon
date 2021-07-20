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
    // Temporary test data
    const testUser1 = {
        userId: 0,
        name: "Dummy1",
        isSystemAdmin: true,
        isOrganisationAdmin: true,
        isGroupAdmin: true,
    }
    const testUser2 = {
        userId: 1,
        name: "Dummy2",
        isSystemAdmin: false,
        isOrganisationAdmin: true,
        isGroupAdmin: true,
    }
    const testUser3 = {
        userId: 2,
        name: "Dummy3",
        isSystemAdmin: false,
        isOrganisationAdmin: false,
        isGroupAdmin: true,
    }
    const testUser4 = {
        userId: 3,
        name: "Dummy4",
        isSystemAdmin: false,
        isOrganisationAdmin: false,
        isGroupAdmin: false,
    }

    const testUser5: IUser = {
        email: "test.testesen@ciber.no",
        name: "Test Testesen",
        userId: 5,
    }
    const testUser6: IUser = {
        email: "hans.hansen@ciber.no",
        name: "Hans Hansen",
        userId: 6,
    }
    const testUser7: IUser = {
        email: "kari.karisen@ciber.no",
        name: "Kari Karisen",
        userId: 7,
    }

    const testOrganisation1 = {
        organisationId: 0,
        name: "Norge",
        address: "Emma Hjorths vei 50, 1336 Sandvika, Norge",
        phoneNumber: "67 17 48 80",
        email: "post@dissimilis.no",
        notes: "Dissimilis Norge holder til i Sandvika og er en organisasjon",
        admins: [testUser1],
        members: [testUser1, testUser2, testUser3, testUser4],
    }
    const testOrganisation2 = {
        organisationId: 1,
        name: "Sverige",
        address: "Medelsvenssonsgate 18, 12323 Stockholm, Sverige",
        phoneNumber: "023-314 45",
        email: "post@dissimilis.se",
        notes: "Dissimilis Sverige är baserat i Stockholm och är en organisation",
        admins: [testUser3, testUser4],
        members: [testUser2, testUser3, testUser4],
    }
    const testGroup1: IGroup = {
        groupId: 0,
        name: "Oslo",
        admins: [testUser5],
        members: [testUser5],
        address: "Medelsvenssonsgate 18, 12323 Stockholm, Sverige",
        phoneNumber: "023-314 45",
        email: "post@dissimilis.se",
        notes: "Dissimilis Sverige är baserat i Stockholm och är en organisation",
    }
    const testGroup2: IGroup = {
        groupId: 1,
        name: "Bærum",
        admins: [testUser6],
        members: [testUser6, testUser5, testUser7],
        address: "Medelsvenssonsgate 18, 12323 Stockholm, Sverige",
        phoneNumber: "023-314 45",
        email: "post@dissimilis.se",
        notes: "Dissimilis Sverige är baserat i Stockholm och är en organisation",
    }
    const testGroup3: IGroup = {
        groupId: 2,
        name: "Trondheim",
        admins: [testUser6, testUser5, testUser7],
        members: [testUser6, testUser5, testUser7],
        address: "Medelsvenssonsgate 18, 12323 Stockholm, Sverige",
        phoneNumber: "023-314 45",
        email: "post@dissimilis.se",
        notes: "Dissimilis Sverige är baserat i Stockholm och är en organisation",
    }

    const groups = [testGroup1, testGroup2, testGroup3]
    const currentUser = testUser1

    const classes = useStyles()
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const history = useHistory()

    const { getUser, userInit } = useGetUser()
    const userId = userInit?.userId

    const [inviteUserDialogIsOpen, setInviteUserDialogIsOpen] = useState(false)
    const [addGroupIsOpen, setAddGroupIsOpen] = useState(false)

    const { organisationId } = useParams<{ organisationId: string }>()

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/library`)
    }

    const userIsSystemAdmin = (user: number | undefined) => {
        return currentUser.isSystemAdmin
    }

    const userIsOrganisationAdmin = (userId: number | undefined) => {
        return currentUser.isOrganisationAdmin
    }

    const userIsGroupAdmin = (userId: number | undefined) => {
        return currentUser.isGroupAdmin
    }

    const userIsNotElevated = (userId: number | undefined) => {
        return (
            !userIsSystemAdmin(userId) &&
            !userIsOrganisationAdmin(userId) &&
            !userIsGroupAdmin(userId)
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
                            <DashboardTopBar
                                onChange={handleOnChangeSearch}
                                searchTerm={searchTerm}
                            />
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
                        {userIsOrganisationAdmin(userId)
                            ? groups.map((group) => {
                                  return (
                                      <Grid item xs={12}>
                                          <AccordionGroupComponent
                                              title={group.name}
                                              users={[
                                                  testUser5,
                                                  testUser6,
                                                  testUser7,
                                              ]}
                                              group={group}
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
                            listOfCountries={[
                                testOrganisation1.name,
                                testOrganisation2.name,
                            ]}
                            listOfGroups={[testGroup1.name]}
                            defaultOrganisation={testOrganisation1.name}
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
                            listOfCountries={[
                                testOrganisation1.name,
                                testOrganisation2.name,
                            ]}
                            userList={[testUser5, testUser6, testUser7]}
                            defaultOrganisation={testOrganisation1.name}
                        />
                    </Dialog>

                    <Typography variant="h2">
                        {userIsNotElevated(userId)
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
