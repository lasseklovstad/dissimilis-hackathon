import React, { useEffect, useState } from "react"
import { Grid, TextField } from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"
import { IGroup } from "../../models/IGroup"
import {
    GroupFilter,
    OrganisationFilter,
    useGetGroups,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"
import { Loading } from "../loading/Loading.component"
import { useHistory } from "react-router"
import { IOrganisation } from "../../models/IOrganisation"
export const SearchFilterAutocomplete = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const { getAllGroups, allGroupsFetched } = useGetGroups(GroupFilter.Admin)
    const [groups, setGroups] = useState<IGroup[] | undefined>()
    useEffect(() => {
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [allGroupsFetched])

    const { getOrganisations, organisationsFetched } = useGetOrganisations(
        OrganisationFilter.Admin
    )
    const [organisations, setorganisations] = useState<
        IOrganisation[] | undefined
    >()
    useEffect(() => {
        if (organisationsFetched) {
            setorganisations(organisationsFetched)
        }
    }, [organisationsFetched])

    const groupValues = groups?.map((group) => group.groupName)
    const organisationValues = organisations?.map(
        (organisation) => organisation.organisationName
    )
    const returnValues = [
        ...(groupValues ? groupValues : []),
        ...(organisationValues ? organisationValues : []),
    ]

    return (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <Autocomplete
                    style={{ marginBottom: "1.5em" }}
                    multiple
                    id="tags-outlined"
                    options={returnValues ? returnValues : []}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    onChange={(event, value) =>
                        history.push(
                            `library?search=${value
                                .map((value) => value)
                                .join("||")}`
                        )
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Choose a group"
                        />
                    )}
                />
            </Grid>
        </>
    )
}
