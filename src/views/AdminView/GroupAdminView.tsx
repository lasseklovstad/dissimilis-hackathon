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
import AddIcon from "@material-ui/icons/Add"
import { colors } from "../../utils/colors"
import { InviteUserToSystemDialog } from "../../components/CustomDialog/InviteUserToSystemDialog.components"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { IUser } from "../../models/IUser"
import { AccordionGroupComponent } from "../../components/AdminViewComponents/AccordionGroupComponent.component"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"

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
    buttonText: {
        paddingLeft: "8px",
        paddingRight: "8px",
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
    },
})

export const GroupAdminView = () => {
    // Temporary test data
    const testUser1 = {
        userId: 0,
        name: "Dummy1",
        isSystemAdmin: true,
        isCountryAdmin: true,
        isGroupAdmin: true,
    }
    const testUser2 = {
        userId: 1,
        name: "Dummy2",
        isSystemAdmin: false,
        isCountryAdmin: true,
        isGroupAdmin: true,
    }
    const testUser3 = {
        userId: 2,
        name: "Dummy3",
        isSystemAdmin: false,
        isCountryAdmin: false,
        isGroupAdmin: true,
    }
    const testUser4 = {
        userId: 3,
        name: "Dummy4",
        isSystemAdmin: false,
        isCountryAdmin: false,
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

    const testCountry1 = {
        countryId: 0,
        name: "Norge",
        notes: `Emma Hjorths vei 50, 1336 Sandvika, Norge
                Telefon: 67 17 48 80 
                post@dissimilis.no`,
        admins: [testUser1],
        members: [testUser1, testUser2, testUser3, testUser4],
    }
    const testCountry2 = {
        countryId: 1,
        name: "Sverige",
        notes: `Medelsvendsonsgate 50, 12323 Stockholm, Sverige
                Telefon: 67 17 48 80 
                post@dissimilis.se`,
        admins: [testUser3],
        members: [testUser2, testUser3, testUser4],
    }
    const testGroup1 = {
        groupId: 0,
        name: "Oslo",
        admins: [testUser2],
        members: [testUser2, testUser3, testUser4],
    }
    const testGroup2 = {
        groupId: 1,
        name: "Bærum",
        admins: [testUser2],
        members: [testUser2, testUser3, testUser4],
    }
    const testGroup3 = {
        groupId: 2,
        name: "Trondheim",
        admins: [testUser2],
        members: [testUser2, testUser3, testUser4],
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

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/library`)
    }

    const userIsSystemAdmin = (user: number | undefined) => {
        return currentUser.isSystemAdmin
    }

    const userIsCountryAdmin = (userId: number | undefined) => {
        return currentUser.isCountryAdmin
    }

    const userIsGroupAdmin = (userId: number | undefined) => {
        return currentUser.isGroupAdmin
    }

    const userIsNotElevated = (userId: number | undefined) => {
        return (
            !userIsSystemAdmin(userId) &&
            !userIsCountryAdmin(userId) &&
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
        //Legg til Land
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
                            >
                                <ArrowBackIosIcon />
                                <div className={classes.buttonText}>
                                    {t("AdminView.backToAdminpanel")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h1">Land - Grupper</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setInviteUserDialogIsOpen(true)
                                }}
                            >
                                <AddIcon />
                                <div className={classes.buttonText}>
                                    {t("AdminView.inviteUser")}
                                </div>
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                disableFocusRipple
                                className={classes.button}
                                onClick={() => {
                                    setAddGroupIsOpen(true)
                                }}
                            >
                                <AddIcon />
                                <div className={classes.buttonText}>
                                    {t("AdminView.addGroup")}
                                </div>
                            </Button>
                        </Grid>
                        {userIsCountryAdmin(userId)
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
                                testCountry1.name,
                                testCountry2.name,
                            ]}
                            listOfGroups={[testGroup1.name]}
                            defaultCountry={testCountry1.name}
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
                                testCountry1.name,
                                testCountry2.name,
                            ]}
                            userList={[testUser5, testUser6, testUser7]}
                            defaultCountry={testCountry1.name}
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
