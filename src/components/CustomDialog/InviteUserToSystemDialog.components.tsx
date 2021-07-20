import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core"

import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { useTranslation } from "react-i18next"
import {
    OrganisationFilter,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"
import { IOrganisation, IOrganisationIndex } from "../../models/IOrganisation"
import { IGroupIndex } from "../../models/IGroup"

const useStyles = makeStyles((theme) => {
    return {
        formControl: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
            minWidth: 120,
            width: "100%",
        },
        caption: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(3),
        },
        inputElements: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
    }
})

export const InviteUserToSystemDialog = (props: {
    handleOnSaveClick: (value: string) => void
    handleOnCancelClick: () => void
    defaultOrganisationId?: number
    userIsSystemAdmin: boolean
    isLoading?: boolean
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isLoading,
        defaultOrganisationId,
        userIsSystemAdmin,
    } = props
    const { t } = useTranslation()
    const classes = useStyles()
    const [organisations, setOrganisations] = useState<IOrganisationIndex[]>()
    setOrganisations([{ organisationId: 0, name: "Norge" }])
    const [groups, setGroups] = useState<IGroupIndex[]>()
    setGroups([
        {
            groupId: 0,
            name: "Oslo",
            organisationId: 0,
            organisationName: "Norge",
        },
    ])
    /*
    if (userIsSystemAdmin) {
        const { getOrganisations, organisationsFetched } = useGetOrganisations(
            OrganisationFilter.All
        )
        setOrganisations(organisationsFetched)
    } else {
        const {
            getOrganisations: getAdminOrganisations,
            organisationsFetched: adminOrganisationsFetched,
        } = useGetOrganisations(OrganisationFilter.Admin)
        const {
            getOrganisations: getGroupAdminOrganisations,
            organisationsFetched: groupAdminOrganisationsFetched,
        } = useGetOrganisations(OrganisationFilter.GroupAdmin)
        const organisationsFetched = adminOrganisationsFetched?.slice() || []
        const orgIds =
            adminOrganisationsFetched?.map((organisation) => {
                return organisation.organisationId
            }) || []
        groupAdminOrganisationsFetched?.map((organisation) => {
            if (!(organisation.organisationId in orgIds)) {
                organisationsFetched.push(organisation)
            }
        })
        setOrganisations(organisationsFetched)
    }
    */

    const [textFieldInput, setTextFieldInput] = useState("")
    const [organisationInput, setOrganisationInput] = useState<number>()
    const [groupInput, setGroupInput] = useState("")

    /*
    useEffect(() => {
        if (defaultOrganisationId) {
            setOrganisationInput(defaultOrganisationId)
        }
    }, [defaultOrganisationId])
    */
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(textFieldInput)
            }}
        >
            <DialogTitle> {t("AdminView.inviteUser")} </DialogTitle>
            <DialogContent>
                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserCountry")}
                </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t("AdminView.countries")}</InputLabel>
                    <Select
                        value={organisationInput}
                        onChange={(e: React.ChangeEvent<{ value: any }>) => {
                            setOrganisationInput(e.target.value)
                        }}
                        label={t("AdminView.countries")}
                    >
                        {organisations
                            ? organisations.map((organisation) => {
                                  return (
                                      <MenuItem
                                          key={organisation.organisationId}
                                          value={organisation.organisationId}
                                      >
                                          {" "}
                                          {organisation.name}{" "}
                                      </MenuItem>
                                  )
                              })
                            : ""}
                    </Select>
                </FormControl>

                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserGroup")}
                </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>{t("AdminView.group")}</InputLabel>
                    <Select
                        value={groupInput}
                        onChange={(e: React.ChangeEvent<{ value: any }>) => {
                            setGroupInput(e.target.value)
                        }}
                        label={t("AdminView.groups")}
                    >
                        <MenuItem value=""> {t("AdminView.noGroup")} </MenuItem>
                        {groups
                            ? groups.map((group) => {
                                  return (
                                      <MenuItem
                                          key={group.groupId}
                                          value={group.groupId}
                                      >
                                          {" "}
                                          {group.name}{" "}
                                      </MenuItem>
                                  )
                              })
                            : ""}
                    </Select>
                </FormControl>

                <Typography variant="caption" className={classes.caption}>
                    {t("AdminView.newUserEmail")}
                </Typography>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: 250 }}
                    helperText={`${textFieldInput.length}/${250}`}
                    value={textFieldInput}
                    className={classes.inputElements}
                    variant="filled"
                    onChange={(e) => {
                        setTextFieldInput(e.target.value)
                    }}
                    label={"Epost"}
                    style={{ width: "100%" }}
                />
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <DialogButton
                        disabled={!textFieldInput || !organisationInput}
                        type="submit"
                        variant="contained"
                    >
                        {"Inviter bruker"}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setTextFieldInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
