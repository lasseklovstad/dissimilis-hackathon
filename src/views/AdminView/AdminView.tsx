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
import { colors } from "../../utils/colors"
import { InviteUserToSystemDialog } from "../../components/CustomDialog/InviteUserToSystemDialog.components"
import { AddCountryDialog } from "../../components/CustomDialog/AddCountryDialog.component"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { IUser } from "../../models/IUser"

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
    },
})

export const AdminView = () => {
    // Temporary test data
    const testUser1 = {
        userId: 0,
        name: "Per Jensen",
        email: "user1@mail.no",
        isSystemAdmin: true,
        isCountryAdmin: true,
        isGroupAdmin: true,
    }
    const testUser2 = {
        userId: 1,
        name: "Jens Persson",
        email: "user2@mail.no",
        isSystemAdmin: false,
        isCountryAdmin: true,
        isGroupAdmin: true,
    }
    const testUser3 = {
        userId: 2,
        name: "Navn Navnesen",
        email: "user3@mail.no",
        isSystemAdmin: false,
        isCountryAdmin: false,
        isGroupAdmin: true,
    }
    const testUser4 = {
        userId: 3,
        name: "Lisa Gikktilskolensen",
        email: "user4@mail.no",
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
        address: "Emma Hjorths vei 50, 1336 Sandvika, Norge",
        phoneNumber: "67 17 48 80",
        email: "post@dissimilis.no",
        notes: "Dissimilis Norge holder til i Sandvika og er en organisasjon",
        admins: [testUser1],
        members: [testUser1, testUser2, testUser3, testUser4],
    }
    const testCountry2 = {
        countryId: 1,
        name: "Sverige",
        address: "Medelsvenssonsgate 18, 12323 Stockholm, Sverige",
        phoneNumber: "023-314 45",
        email: "post@dissimilis.se",
        notes: "Dissimilis Sverige är baserat i Stockholm och är en organisation",
        admins: [testUser3, testUser4],
        members: [testUser2, testUser3, testUser4],
    }
    const countries = [testCountry1, testCountry2]
    const testGroup = {
        groupId: 0,
        name: "Oslo",
        admins: [testUser2],
        members: [testUser2, testUser3, testUser4],
    }
    const currentUser = testUser1
    // End of temporary test data

    const classes = useStyles()
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const history = useHistory()

    const { getUser, userInit } = useGetUser()
    const userId = userInit?.userId

    const [inviteUserDialogIsOpen, setInviteUserDialogIsOpen] = useState(false)
    const [addCountryIsOpen, setAddCountryIsOpen] = useState(false)
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

    const handleAddCountryDialogClose = () => {
        setAddCountryIsOpen(false)
    }
    const handleAddCountryDialogSave = () => {
        //Legg til Land
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
                            <Typography variant="h1">
                                {t("AdminView.adminPanel")}
                            </Typography>
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
                                    setAddCountryIsOpen(true)
                                }}
                            >
                                <AddIcon />
                                <div className={classes.buttonText}>
                                    {t("AdminView.addCountry")}
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
                            ? countries.map((country) => {
                                  return (
                                      <Grid item xs={12}>
                                          <AccordionComponent
                                              countryId={country.countryId}
                                              country={country}
                                              title={country.name}
                                              description={country.notes}
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
                            listOfGroups={[testGroup.name]}
                            defaultCountry={testCountry1.name}
                        />
                    </Dialog>

                    <Dialog
                        open={addCountryIsOpen}
                        onClose={handleAddCountryDialogClose}
                        aria-labelledby={t("AdminView.addCountry")}
                    >
                        <AddCountryDialog
                            handleOnSaveClick={handleAddCountryDialogSave}
                            handleOnCancelClick={handleAddCountryDialogClose}
                            userList={[testUser5, testUser6, testUser7]}
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
