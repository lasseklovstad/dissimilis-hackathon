import { Autocomplete, TextField } from "@mui/material"
import { IGroupIndex } from "../../models/IGroup"
import { GroupFilter, useGetGroups } from "../../utils/useApiServiceGroups"

type GroupAutocompleteProps = {
    selectedGroups: string[]
    onGroupChange: (selectedGroups: IGroupIndex[]) => Promise<void> | void
    label: string
    groupFilter?: GroupFilter
}

export const GroupAutocomplete = (props: GroupAutocompleteProps) => {
    const { selectedGroups, onGroupChange, label, groupFilter } = props
    const { allGroupsFetched } = useGetGroups(groupFilter)

    return (
        <Autocomplete
            id="groups-autocomplete"
            multiple
            options={allGroupsFetched || []}
            value={allGroupsFetched?.filter((group) =>
                selectedGroups.includes(group.groupId.toString())
            )}
            getOptionLabel={(option) => option.groupName}
            filterSelectedOptions
            onChange={(e, selected) => onGroupChange(selected)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder={label}
                    margin="normal"
                    inputProps={{ ...params.inputProps, "aria-label": label }}
                />
            )}
        />
    )
}
