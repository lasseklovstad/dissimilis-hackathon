import React, { useEffect, useState } from "react"
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
import { useGetAdminStatuses } from "../../utils/useApiServiceUsers"
import { Add as AddIcon } from "@material-ui/icons"
import { colors } from "../../utils/colors"
import { InviteUserToSystemDialog } from "../../components/CustomDialog/InviteUserToSystemDialog.components"
import { AddGroupDialog } from "../../components/CustomDialog/AddGroupDialog.component"
import { AccordionGroupComponent } from "../../components/AdminViewComponents/AccordionGroupComponent.component"
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos"
import { IGroupIndex } from "../../models/IGroup"
import {
    GroupFilter,
    useGetGroupsInOrganisation,
    useGetOrganisation,
    usePostGroup,
} from "../../utils/useApiServiceGroups"

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
        [theme.breakpoints.down("sm")]: {
            paddingBottom: theme.spacing(2),
        },
        [theme.breakpoints.up("md")]: {
            paddingRight: theme.spacing(2),
        },
    },
    accordionComponent: {
        [theme.breakpoints.down("md")]: {
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
    const history = useHistory()
    const { organisationId } = useParams<{ organisationId: string }>()

    const { postGroup } = usePostGroup()

    const { adminStatuses } = useGetAdminStatuses()
    const userId = sessionStorage.getItem("userId") || ""

    const { organisationFetched } = useGetOrganisation(parseInt(organisationId))

    const userIsSystemAdmin = () => adminStatuses?.systemAdmin || false

    const userIsAdminInCurrentOrganisation = () =>
        (userId && organisationFetched?.admins
            ? organisationFetched?.admins.some(
                  (admin) => admin.userId.toString() === userId
              )
            : false) || userIsSystemAdmin()

    const { getGroups, groupsFetched } = useGetGroupsInOrganisation(
        userIsAdminInCurrentOrganisation()
            ? GroupFilter.All
            : GroupFilter.Admin,
        parseInt(organisationId)
    )

    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()

    useEffect(() => {
        if (groupsFetched) {
            setGroups(groupsFetched)
        }
    }, [groupsFetched])

    const [inviteUserDialogIsOpen, setInviteUserDialogIsOpen] = useState(false)
    const [addGroupIsOpen, setAddGroupIsOpen] = useState(false)

    const userIsGroupAdmin = () =>
        (groupsFetched ? groupsFetched?.length > 0 : false) ||
        userIsAdminInCurrentOrganisation()

    const removeGroupAccordion = (groupId: number) => {
        setGroups(groups?.filter((group) => group.groupId !== groupId))
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
                //Launch snackbar
            }
        } else {
            //Launch snackbar
        }
    }

    const updateGroups = async () => {
        const { error, result } = await getGroups.run()
        if (!error && result) {
            setGroups(result.data)
        }
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
                    {userIsGroupAdmin() ? (
                        <>
                            <Grid container item xs={12} sm={10}>
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
                                    <Typography
                                        className={classes.headers}
                                        variant="h1"
                                    >
                                        {`${organisationFetched?.organisationName}`}
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
                            userIsSystemAdmin={userIsSystemAdmin()}
                        />
                    </Dialog>
                </Grid>
            </Box>
        </>
    )
}
