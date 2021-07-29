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
import { useGetAdminStatuses } from "../../utils/useApiServiceUsers"
import { AccordionComponent } from "../../components/AdminViewComponents/AccordionComponent.component"
import {
    Add as AddIcon,
    Edit as EditIcon,
    List as ListIcon,
} from "@material-ui/icons"
import { colors } from "../../utils/colors"
import { AddOrganisationDialog } from "../../components/CustomDialog/AddOrganisationDialog.component"
import {
    OrganisationFilter,
    useGetOrganisations,
    usePostOrganisation,
} from "../../utils/useApiServiceGroups"
import { IOrganisationIndex } from "../../models/IOrganisation"
import { EditSysAdminsDialog } from "../../components/CustomDialog/EditSysAdmins.components"
import { EditSystemMembersDialog } from "../../components/CustomDialog/EditSystemMembersDialog.component"

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
        padding: "16px 8px",
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
    },
}))

export const AdminView = () => {
    const classes = useStyles()
    const { t } = useTranslation()

    const { postOrganisation } = usePostOrganisation()

    const { adminStatuses } = useGetAdminStatuses()

    const userIsSystemAdmin = () => adminStatuses?.systemAdmin || false

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

    const [adminOrganisations, setAdminOrganisations] = useState<
        IOrganisationIndex[] | undefined
    >()
    const [groupAdminOrganisations, setGroupAdminOrganisations] = useState<
        IOrganisationIndex[] | undefined
    >()

    useEffect(() => {
        if (adminOrganisationsFetched) {
            setAdminOrganisations(adminOrganisationsFetched)
        }
    }, [adminOrganisationsFetched])

    useEffect(() => {
        if (groupAdminOrganisationsFetched) {
            setGroupAdminOrganisations(groupAdminOrganisationsFetched)
        }
    }, [groupAdminOrganisationsFetched])

    const [addOrganisationIsOpen, setAddOrganisationIsOpen] = useState(false)
    const [editSysAdminsDialogIsOpen, setEditSysAdminsDialogIsOpen] =
        useState(false)
    const [editMembersDialogIsOpen, setEditMembersDialogIsOpen] =
        useState(false)

    const renderedAdminOrganisationIds: number[] = []

    const userIsOrganisationAdmin = () =>
        (adminOrganisationsFetched
            ? adminOrganisationsFetched?.length > 0
            : false) || userIsSystemAdmin()

    const userIsGroupAdmin = () =>
        (groupAdminOrganisationsFetched
            ? groupAdminOrganisationsFetched?.length > 0
            : false) || userIsOrganisationAdmin()

    const removeOrganisationAccordion = (organisationId: number) => {
        setAdminOrganisations(
            adminOrganisations?.filter(
                (organisation) => organisation.organisationId !== organisationId
            )
        )
        setGroupAdminOrganisations(
            groupAdminOrganisations?.filter(
                (organisation) => organisation.organisationId !== organisationId
            )
        )
        renderedAdminOrganisationIds.length = 0 // Clear the array
    }

    const handleAddOrganisationDialogClose = () => {
        setAddOrganisationIsOpen(false)
    }

    const handleEditMembersDialogClose = () => {
        setEditMembersDialogIsOpen(false)
    }

    const handleAddOrganisationDialogSave = async (
        name: string,
        firstAdminId?: number
    ) => {
        if (firstAdminId) {
            const { error, result } = await postOrganisation.run({
                name,
                firstAdminId,
            })
            if (!error && result) {
                setAddOrganisationIsOpen(false)
                updateOrganisation()
            } else {
                //Launch snackbar
            }
        } else {
            //Launch snackbar
        }
    }

    const handleEditSysAdminsDialogClose = () => {
        setEditSysAdminsDialogIsOpen(false)
    }

    const updateOrganisation = async () => {
        const { error: adminOrgError, result: adminOrgResult } =
            await getAdminOrganisations.run()
        if (!adminOrgError && adminOrgResult) {
            setAdminOrganisations(adminOrgResult.data)
            renderedAdminOrganisationIds.length = 0
        }
        const { error: groupAdminError, result: groupAdminResult } =
            await getGroupAdminOrganisations.run()
        if (!groupAdminError && groupAdminResult) {
            setGroupAdminOrganisations(groupAdminResult.data)
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
                    <Grid container item xs={12} sm={10}>
                        <Grid item xs={12}>
                            <Typography
                                className={classes.headers}
                                variant="h1"
                            >
                                {t("AdminView.adminPanel")}
                            </Typography>
                        </Grid>
                        {userIsSystemAdmin() && (
                            <Grid container className={classes.adminButtons}>
                                <Grid
                                    item
                                    className={classes.buttonGridComponent}
                                    xs={12}
                                    md={4}
                                >
                                    <Button
                                        disableFocusRipple
                                        className={classes.button}
                                        onClick={() => {
                                            setAddOrganisationIsOpen(true)
                                        }}
                                        disabled={!userIsSystemAdmin()}
                                    >
                                        <AddIcon />
                                        <div className={classes.buttonText}>
                                            {t("AdminView.addCountry")}
                                        </div>
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    className={classes.buttonGridComponent}
                                    xs={12}
                                    md={4}
                                >
                                    <Button
                                        disableFocusRipple
                                        className={classes.button}
                                        onClick={() => {
                                            setEditSysAdminsDialogIsOpen(true)
                                        }}
                                        disabled={!userIsSystemAdmin()}
                                    >
                                        <EditIcon />
                                        <div className={classes.buttonText}>
                                            {t("Dialog.editSysAdmins")}
                                        </div>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        disableFocusRipple
                                        className={classes.button}
                                        onClick={() => {
                                            setEditMembersDialogIsOpen(true)
                                        }}
                                        disabled={!userIsSystemAdmin()}
                                    >
                                        <ListIcon />
                                        <div className={classes.buttonText}>
                                            {t("AdminView.seeAllMembers")}
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
                                {t("AdminView.countries")}
                            </Typography>
                        </Grid>
                        {userIsOrganisationAdmin() &&
                            adminOrganisations?.map((organisation) => {
                                renderedAdminOrganisationIds.push(
                                    organisation.organisationId
                                )
                                return (
                                    <Grid
                                        item
                                        className={classes.accordionComponent}
                                        xs={12}
                                    >
                                        <AccordionComponent
                                            organisationId={
                                                organisation.organisationId
                                            }
                                            title={
                                                organisation.organisationName
                                            }
                                            userIsSysAdm={userIsSystemAdmin()}
                                            removeOrganisation={
                                                removeOrganisationAccordion
                                            }
                                            buttonsIsDisabled={false}
                                        />
                                    </Grid>
                                )
                            })}
                        {userIsGroupAdmin() &&
                            groupAdminOrganisations?.map(
                                (organisation) =>
                                    !renderedAdminOrganisationIds.includes(
                                        organisation.organisationId
                                    ) && (
                                        <Grid item xs={12}>
                                            <AccordionComponent
                                                organisationId={
                                                    organisation.organisationId
                                                }
                                                title={
                                                    organisation.organisationName
                                                }
                                                userIsSysAdm={userIsSystemAdmin()}
                                                removeOrganisation={
                                                    removeOrganisationAccordion
                                                }
                                            />
                                        </Grid>
                                    )
                            )}
                    </Grid>
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
                        open={editMembersDialogIsOpen}
                        onClose={handleEditMembersDialogClose}
                        aria-labelledby={t("AdminView.seeAllMembers")}
                    >
                        <EditSystemMembersDialog
                            handleOnCloseClick={handleEditMembersDialogClose}
                        />
                    </Dialog>
                    <Dialog
                        open={editSysAdminsDialogIsOpen}
                        onClose={() => setEditSysAdminsDialogIsOpen(false)}
                        aria-label={t("Dialog.editSysAdmins")}
                        maxWidth="xs"
                        fullWidth
                    >
                        <EditSysAdminsDialog
                            handleOnCloseClick={handleEditSysAdminsDialogClose}
                        />
                    </Dialog>

                    <Typography variant="h2">
                        {!userIsGroupAdmin() && t("AdminView.noPermissions")}
                    </Typography>
                </Grid>
            </Box>
        </>
    )
}
