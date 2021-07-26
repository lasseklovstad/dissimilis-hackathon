import React, { useEffect, useState } from "react"
import {
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core"

import { DialogButton } from "../CustomDialogComponents/DialogButton.components"
import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"
import { IUser } from "../../models/IUser"
import { useGetUsers } from "../../utils/useApiServiceUsers"
import { useGetGroupOrOrganisationMembers } from "../../utils/useApiServiceGroups"

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

export const AddGroupMemberDialog = (props: {
    handleOnSaveClick: (value: IUser | undefined) => void
    handleOnCancelClick: () => void
    isLoading?: boolean
    isGroup: boolean
    groupId: number
    title: string
    descriptionText?: string
    saveText: string
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isLoading,
        isGroup,
        groupId,
        title,
        descriptionText = "",
        saveText,
    } = props

    const { t } = useTranslation()
    const classes = useStyles()

    const [userInput, setUserInput] = useState("")

    const { getUsers, users } = useGetUsers()

    const [userListProps, setUserListProps] = useState<any>({
        options: users,
        getOptionLabel: (user: IUser) => user.email,
    })

    const { getGroupMembers, groupMembers } = useGetGroupOrOrganisationMembers(
        isGroup,
        groupId
    )

    useEffect(() => {
        setUserListProps({
            options: users?.filter(
                (user) =>
                    !groupMembers?.some(
                        (member) => user.userId === member.userId
                    )
            ),
            getOptionLabel: (user: IUser) => user.email,
        })
    }, [users, groupMembers])

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                if (users && users?.length > 0) {
                    handleOnSaveClick(
                        users?.find((user) => user.email === userInput)
                    )
                }
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="caption">{descriptionText}</Typography>
                <Autocomplete
                    {...userListProps}
                    inputValue={userInput}
                    onInputChange={(event, newInputValue) => {
                        setUserInput(newInputValue)
                    }}
                    id="auto-complete"
                    autoComplete
                    includeInputInList
                    style={{ width: "100%" }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t("Dialog.email")}
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
                        disabled={!userInput}
                        type="submit"
                        variant="contained"
                    >
                        {saveText}
                    </DialogButton>
                )}
                <DialogButton
                    onClick={() => {
                        handleOnCancelClick()
                        setUserInput("")
                    }}
                >
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
