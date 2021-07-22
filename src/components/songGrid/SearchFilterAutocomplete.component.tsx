import React, { useEffect, useState } from "react"
import { TextField } from "@material-ui/core"

import { Autocomplete } from "@material-ui/lab"
import { IGroupIndex } from "../../models/IGroup"
import {
    GroupFilter,
    OrganisationFilter,
    useGetGroups,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"
import { IOrganisationIndex } from "../../models/IOrganisation"
export const SearchFilterAutocomplete = (props: {
    onChange?: (event: any, value: (IGroupIndex | IOrganisationIndex)[]) => void
    values?: (IGroupIndex | IOrganisationIndex)[]
}) => {
    const { onChange, values } = props
    const { getAllGroups, allGroupsFetched } = useGetGroups(GroupFilter.Admin)
    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()
    useEffect(() => {
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [allGroupsFetched])

    const { getOrganisations, organisationsFetched } = useGetOrganisations(
        OrganisationFilter.Admin
    )
    const [organisations, setorganisations] = useState<
        IOrganisationIndex[] | undefined
    >()
    useEffect(() => {
        if (organisationsFetched) {
            setorganisations(organisationsFetched)
        }
    }, [organisationsFetched])

    const returnValues = [
        ...(groups ? groups : []),
        ...(organisations ? organisations : []),
    ]

    return (
        <>
            <Autocomplete
                style={{ marginBottom: "1.5em" }}
                multiple
                id="tags-outlined"
                value={values ? values : []}
                options={returnValues ? returnValues : []}
                getOptionLabel={(option) =>
                    "groupName" in option
                        ? option.groupName
                        : option.organisationName
                }
                filterSelectedOptions
                onChange={onChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Choose a group"
                    />
                )}
            />
        </>
    )
}
