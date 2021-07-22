import React, { ChangeEvent, useEffect, useState } from "react"
import { TextField } from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"
import { IGroup } from "../../models/IGroup"
import {
    GroupFilter,
    OrganisationFilter,
    useGetGroups,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"
import { useHistory, useLocation } from "react-router"
import { IOrganisation } from "../../models/IOrganisation"
export const SearchFilterAutocomplete = (props: {
    filterValue: (IGroup | IOrganisation)[]
    setFilterValue: React.Dispatch<
        React.SetStateAction<(IGroup | IOrganisation)[]>
    >
}) => {
    const { filterValue, setFilterValue } = props
    const { t } = useTranslation()
    const { getAllGroups, allGroupsFetched } = useGetGroups(GroupFilter.Admin)
    const [groups, setGroups] = useState<IGroup[] | undefined>()

    const history = useHistory()
    const location = useLocation()
    const url = new URLSearchParams(location.search)
    const groupIdsFromUrl = url.getAll("groupId")
    const organisationIdsFromUrl = url.getAll("organisationId")

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
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [organisationsFetched, allGroupsFetched])

    useEffect(() => {
        const valueGroups = groups?.filter(
            (group) => groupIdsFromUrl.indexOf(group.groupId.toString()) > -1
        )
        const valueOrganisations = organisations?.filter(
            (organisation) =>
                organisationIdsFromUrl.indexOf(
                    organisation.organisationId.toString()
                ) > -1
        )
        const valuesFromIds = [
            ...(valueGroups ? valueGroups : []),
            ...(valueOrganisations ? valueOrganisations : []),
        ]
        setFilterValue(valuesFromIds)
    }, [organisations, groups])

    const filterOptions = [
        ...(groups ? groups : []),
        ...(organisations ? organisations : []),
    ]

    const handleOnChange = (
        event: any,
        newValue: (IGroup | IOrganisation)[]
    ) => {
        setFilterValue(newValue)
        history.push(
            `library?${newValue
                .map((item) =>
                    "groupName" in item
                        ? "groupId=" + item.groupId
                        : "organisationId=" + item.organisationId
                )
                .join("&")}`
        )
    }

    return (
        <>
            <Autocomplete
                style={{ marginBottom: "1.5em" }}
                value={filterValue}
                multiple
                id="tags-outlined"
                options={filterOptions}
                getOptionLabel={(option) =>
                    "groupName" in option
                        ? option.groupName
                        : option.organisationName
                }
                filterSelectedOptions
                onChange={handleOnChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={t("DashboardView.autoCompleteLabel")}
                    />
                )}
            />
        </>
    )
}
