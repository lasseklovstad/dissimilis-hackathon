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
import AddIcon from "@material-ui/icons/Add"
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
    const history = useHistory()
    const { organisationId } = useParams<{ organisationId: string }>()

    const { postGroup } = usePostGroup()

    const { adminStatuses } = useGetAdminStatuses()
    const userId = sessionStorage.getItem("userId") || ""

    const { organisationFetched } = useGetOrganisation(parseInt(organisationId))

    const userIsSystemAdmin = () => {
        return adminStatuses?.systemAdmin || false
    }

    const userIsAdminInCurrentOrganisation = () => {
        return (
            (userId && organisationFetched?.admins
                ? organisationFetched?.admins.some(
                      (admin) => admin.userId.toString() === userId
                  )
                : false) || userIsSystemAdmin()
        )
    }

    const { groupsFetched } = useGetGroupsInOrganisation(
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

    const userIsGroupAdmin = () => {
        return (
            (groupsFetched ? groupsFetched?.length > 0 : false) ||
            userIsAdminInCurrentOrganisation()
        )
    }

    const removeGroupAccordion = (groupId: number) => {
        setGroups(
            groups?.filter((group) => {
                return group.groupId !== groupId
            })
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
    const handleAddGroupDialogSave = async (
        name: string,
        firstAdminId: number,
        organisationId: number
    ) => {
        const { error, result } = await postGroup.run({
            name,
            firstAdminId,
            organisationId,
        })
        if (!error && result) {
            setAddGroupIsOpen(false)
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
                                        {`${
                                            organisationFetched?.organisationName
                                        } -
                                    ${t("AdminView.groups")}`}
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
                                {userIsAdminInCurrentOrganisation() ? (
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
                                ) : (
                                    ""
                                )}
                                {userIsGroupAdmin()
                                    ? groupsFetched?.map((group) => (
                                          <Grid item xs={12}>
                                              <AccordionGroupComponent
                                                  title={group.groupName}
                                                  groupId={group.groupId}
                                                  userIsOrgAdmin={userIsAdminInCurrentOrganisation()}
                                                  removeGroup={
                                                      removeGroupAccordion
                                                  }
                                              />
                                          </Grid>
                                      ))
                                    : ""}
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
                            defaultOrganisation={organisationFetched}
                            userIsSystemAdmin={userIsSystemAdmin()}
                        />
                    </Dialog>
                </Grid>
            </Box>
        </>
    )
}
