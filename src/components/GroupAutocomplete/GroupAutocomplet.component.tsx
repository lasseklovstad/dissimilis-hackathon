import { Autocomplete, TextField } from "@mui/material"
import { IGroupIndex } from "../../models/IGroup"
import { GroupFilter, useGetGroups } from "../../utils/useApiServiceGroups"

type GroupAutocompleteProps = {
    selectedGroups: string[]
    onGroupChange: (selectedGroups: IGroupIndex[]) => Promise<void> | void
    placeholder: string
    groupFilter?: GroupFilter
}

export const GroupAutocomplete = (props: GroupAutocompleteProps) => {
    const { selectedGroups, onGroupChange, placeholder, groupFilter } = props
    const { allGroupsFetched } = useGetGroups(groupFilter)

    return (
        <Autocomplete
            sx={{
                mb: "1.5em",
                mt: 1,
            }}
            id={"groups-autocomplete"}
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
                    label={placeholder}
                    variant="outlined"
                    placeholder={placeholder}
                />
            )}
        />
    )
}
