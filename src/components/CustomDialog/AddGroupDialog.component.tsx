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
import { Autocomplete } from "@material-ui/lab"
import { IUser } from "../../models/IUser"
import { IOrganisation } from "../../models/IOrganisation"
import {
    useGetOrganisations,
    OrganisationFilter,
} from "../../utils/useApiServiceGroups"

const useStyles = makeStyles((theme) => {
    return {
        inputElements: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
        },
        formControl: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(1),
            minWidth: 120,
            width: "100%",
        },
    }
})

export const AddGroupDialog = (props: {
    handleOnSaveClick: (
        name: string,
        firstAdminId: number,
        organisationId: number
    ) => void
    handleOnCancelClick: () => void
    defaultOrganisation?: IOrganisation
    isLoading?: boolean
    userIsSystemAdmin: boolean
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isLoading,
        defaultOrganisation,
        userIsSystemAdmin,
    } = props

    const { t } = useTranslation()
    const classes = useStyles()

    const {
        getOrganisations: getAdminOrganisations,
        organisationsFetched: adminOrganisationsFetched,
    } = useGetOrganisations(
        userIsSystemAdmin ? OrganisationFilter.All : OrganisationFilter.Admin
    )

    const [groupNameInput, setGroupNameInput] = useState("")
    const [organisationInput, setOrganisationInput] = useState<IOrganisation>()

    const [adminEmailInput, setAdminEmailInput] = useState("")

    const userList: IUser[] = [
        {
            // FJERN
            name: "Håkon",
            email: "håkon@fdsf",
            userId: 2,
            isSystemAdmin: true,
        },
    ]

    const adminListProps = {
        options: userList,
        getOptionLabel: (user: IUser) => user.email,
    }

    useEffect(() => {
        if (defaultOrganisation) {
            setOrganisationInput(defaultOrganisation)
        }
    }, [defaultOrganisation])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                handleOnSaveClick(groupNameInput, 2, 1)
            }}
        >
            <DialogTitle> {t("AdminView.addGroup")} </DialogTitle>
            <DialogContent>
                <Typography variant="caption">
                    {t("AdminView.newGroupName")}
                </Typography>
                <TextField
                    id="input-dialog-textfield"
                    inputProps={{ maxLength: 250 }}
                    helperText={`${groupNameInput.length}/${250}`}
                    autoFocus
                    className={classes.inputElements}
                    value={groupNameInput}
                    variant="filled"
                    onChange={(e) => {
                        setGroupNameInput(e.target.value)
                    }}
                    label={t("AdminView.groupName")}
                    style={{ width: "100%" }}
                />
                <Typography variant="caption">
                    {t("AdminView.newGroupCountry")}
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
                        {adminOrganisationsFetched
                            ? adminOrganisationsFetched.map((organisation) => {
                                  return (
                                      <MenuItem
                                          value={organisation.organisationId}
                                      >
                                          {" "}
                                          {organisation.organisationName}{" "}
                                      </MenuItem>
                                  )
                              })
                            : ""}
                    </Select>
                </FormControl>
                <Typography variant="caption">
                    {t("AdminView.emailNewAdmin")}
                </Typography>
                <Autocomplete
                    {...adminListProps}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    inputValue={adminEmailInput}
                    onInputChange={(event, newInputValue) => {
                        setAdminEmailInput(newInputValue)
                    }}
                    style={{ width: "100%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("AdminView.email")}
                            margin="normal"
                            variant="filled"
                            className={classes.inputElements}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <DialogButton
                        disabled={
                            !groupNameInput ||
                            !adminEmailInput ||
                            !organisationInput
                        }
                        type="submit"
                        variant="contained"
                    >
                        {t("Dialog.create")}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setGroupNameInput("")
                        setAdminEmailInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
