import { Autocomplete, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { IUser } from "../../../models/IUser"
import { useGetMyGroupUsers } from "../../../utils/useApiServiceUsers"

type GroupUsersAutocompleteProps = {
    disableUsers: number[]
    selectedUser: IUser | null
    setSelectedUser: (selectedUser: IUser | null) => void
}

export const GroupUsersAutocomplete = (props: GroupUsersAutocompleteProps) => {
    const { disableUsers, setSelectedUser, selectedUser } = props
    const { myGroupUsers, getMyGroupUsers } = useGetMyGroupUsers()

    return (
        <Autocomplete
            id={"my-group-users-autocomplete"}
            loading={getMyGroupUsers.loading}
            options={myGroupUsers?.results || []}
            getOptionLabel={(option) => option.email}
            getOptionDisabled={(option) => disableUsers.includes(option.userId)}
            value={selectedUser}
            onChange={(e, selected) => setSelectedUser(selected)}
            onInputChange={(e, value) => getMyGroupUsers.run(value)}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" />
            )}
        />
    )
}
