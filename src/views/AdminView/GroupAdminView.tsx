import React, { useEffect, useState } from "react"
import { Box, Button, Dialog, Grid, Typography } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useNavigate, useParams } from "react-router-dom"
import { useGetAdminStatuses } from "../../utils/useApiServiceUsers"
import { Add as AddIcon } from "@mui/icons-material"
import { colors } from "../../utils/colors"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { AccordionGroupComponent } from "../../components/AdminViewComponents/AccordionGroupComponent.component"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import { IGroupIndex } from "../../models/IGroup"
import {
    GroupFilter,
    useGetGroupsInOrganisation,
    useGetOrganisation,
    usePostGroup,
} from "../../utils/useApiServiceGroups"
import { useSnackbarContext } from "../../utils/snackbarContextProvider.component"

const useStyles = makeStyles((theme) => ({
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
    buttonText: {
        padding: "0 8px 0 8px",
        textAlign: "left",
    },
    adminButtons: {
        marginBottom: theme.spacing(4),
    },
    buttonGridComponent: {
        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(2),
        },
        [theme.breakpoints.up("md")]: {
            paddingRight: theme.spacing(2),
        },
    },
    accordionComponent: {
        [theme.breakpoints.down("lg")]: {
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(0),
            paddingLeft: theme.spacing(0),
        },
        [theme.breakpoints.up("lg")]: {
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(0),
            paddingLeft: theme.spacing(0),
        },
    },
    headers: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
}))

export const GroupAdminView = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { launchSnackbar } = useSnackbarContext()
    const { organisationId } = useParams<{ organisationId: string }>()

    const { postGroup } = usePostGroup()

    const { adminStatuses } = useGetAdminStatuses()
    const userId = sessionStorage.getItem("userId") || ""

    const { organisationFetched } = useGetOrganisation(organisationId)

    const userIsSystemAdmin = () => adminStatuses?.systemAdmin || false

    const userIsAdminInCurrentOrganisation = () =>
        (userId && organisationFetched?.admins
            ? organisationFetched?.admins.some(
                  (admin) => admin.userId.toString() === userId
              )
            : false) || userIsSystemAdmin()

    const { getAllGroups, allGroupsFetched } = useGetGroupsInOrganisation(
        organisationId,
        userIsAdminInCurrentOrganisation() ? undefined : GroupFilter.Admin
    )

    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()

    useEffect(() => {
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [allGroupsFetched])

    const [addGroupIsOpen, setAddGroupIsOpen] = useState(false)

    const userIsGroupAdmin = () =>
        (allGroupsFetched ? allGroupsFetched?.length > 0 : false) ||
        userIsAdminInCurrentOrganisation()

    const removeGroupAccordion = (groupId: number) => {
        setGroups(groups?.filter((group) => group.groupId !== groupId))
    }

    const handleAddGroupDialogClose = () => {
        setAddGroupIsOpen(false)
    }
    const handleAddGroupDialogSave = async (
        name: string,
        organisationId: number | undefined,
        firstAdminId: number | undefined
    ) => {
        if (firstAdminId && organisationId) {
            const { error, result } = await postGroup.run({
                name,
                organisationId,
                firstAdminId,
            })
            if (!error && result) {
                setAddGroupIsOpen(false)
                updateGroups()
            } else {
                launchSnackbar(t("Snackbar.addGroup"), true)
            }
        } else {
            launchSnackbar(t("Snackbar.addGroup"), true)
        }
    }

    const updateGroups = async () => {
        const { error, result } = await getAllGroups.run()
        if (!error && result) {
            setGroups(result.data)
        }
    }
    const handleSearchTerm = (searchTerm: string) => {
        navigate(`/library?search=${searchTerm}`)
    }

    return (
        <>
            <Box mx={2}>
                <Grid
                    container
                    justifyContent="center"
                    className={classes.container}
                >
                    <Grid item xs={12}>
                        <Box mb={4}>
                            <DashboardTopBar
                                handleOnSubmitSearch={handleSearchTerm}
                            />
                        </Box>
                    </Grid>
                    {userIsGroupAdmin() ? (
                        <>
                            <Grid container item xs={12} sm={10}>
                                <Grid item xs={12}>
                                    <Button
                                        disableFocusRipple
                                        onClick={() => navigate("/admin")}
                                        className={classes.returnButton}
                                    >
                                        <ArrowBackIosIcon />
                                        <div className={classes.buttonText}>
                                            {t("AdminView.backToAdminpanel")}
                                        </div>
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        className={classes.headers}
                                        variant="h1"
                                    >
                                        {`${organisationFetched?.organisationName}`}
                                    </Typography>
                                </Grid>
                                {userIsAdminInCurrentOrganisation() && (
                                    <Grid
                                        container
                                        className={classes.adminButtons}
                                    >
                                        <Grid item xs={12} md={4}>
                                            <Button
                                                disableFocusRipple
                                                className={classes.button}
                                                onClick={() => {
                                                    setAddGroupIsOpen(true)
                                                }}
                                            >
                                                <AddIcon />

                                                <div
                                                    className={
                                                        classes.buttonText
                                                    }
                                                >
                                                    {t("AdminView.addGroup")}
                                                </div>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Typography
                                        className={classes.headers}
                                        variant="h2"
                                    >
                                        {t("AdminView.groups")}
                                    </Typography>
                                </Grid>
                                {userIsGroupAdmin() &&
                                    groups?.map((group) => (
                                        <Grid
                                            key={group.groupId}
                                            item
                                            className={
                                                classes.accordionComponent
                                            }
                                            xs={12}
                                        >
                                            <AccordionGroupComponent
                                                title={group.groupName}
                                                groupId={group.groupId}
                                                userIsOrgAdmin={userIsAdminInCurrentOrganisation()}
                                                removeGroup={
                                                    removeGroupAccordion
                                                }
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </>
                    ) : (
                        <Typography variant="h2">
                            {t("AdminView.noPermissions")}
                        </Typography>
                    )}
                    <Dialog
                        open={addGroupIsOpen}
                        onClose={handleAddGroupDialogClose}
                        aria-labelledby={t("AdminView.addGroup")}
                    >
                        <AddGroupDialog
                            handleOnSaveClick={handleAddGroupDialogSave}
                            handleOnCancelClick={handleAddGroupDialogClose}
                            userIsSystemAdmin={userIsSystemAdmin()}
                        />
                    </Dialog>
                </Grid>
            </Box>
        </>
    )
}
