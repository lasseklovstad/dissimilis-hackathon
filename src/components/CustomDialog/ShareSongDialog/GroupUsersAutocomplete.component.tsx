import { Autocomplete, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { IUser } from "../../../models/IUser"
import { useGetMyGroupUsers } from "../../../utils/useApiServiceUsers"

type GroupUsersAutocompleteProps = {
    disableUsers: number[]
    selectedUser: IUser | null
    setSelectedUser: (selectedUser: IUser | null) => void
}

export const GroupUsersAutocomplete = ({
    disableUsers,
    setSelectedUser,
    selectedUser,
}: GroupUsersAutocompleteProps) => {
    const { myGroupUsers, getMyGroupUsers } = useGetMyGroupUsers()
    const { t } = useTranslation()

    return (
        <Autocomplete
            id="my-group-users-autocomplete"
            loading={getMyGroupUsers.loading}
            options={myGroupUsers?.results || []}
            getOptionLabel={(option) => option.email}
            getOptionDisabled={(option) => disableUsers.includes(option.userId)}
            value={selectedUser}
            onChange={(e, selected) => setSelectedUser(selected)}
            onInputChange={(e, value) => getMyGroupUsers.run(value)}
            isOptionEqualToValue={(option, value) =>
                option.email === value.email
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    autoFocus
                    margin="normal"
                    placeholder={t("Dialog.email")}
                    inputProps={{
                        ...params.inputProps,
                        "aria-label": t("Dialog.email"),
                    }}
                />
            )}
        />
    )
}
