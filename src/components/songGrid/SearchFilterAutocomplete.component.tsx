import React, { useEffect, useState } from "react"
import { Grid, TextField } from "@material-ui/core"

import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"
import { IGroupIndex } from "../../models/IGroup"
import { IOrganisationIndex } from "../../models/IOrganisation"

import {
    useGetGroups,
    useGetOrganisations,
} from "../../utils/useApiServiceGroups"
import { useLocation } from "react-router"
import { SortingButtons } from "../DashboardButtons/DashboardButtons"

export const SearchFilterAutocomplete = (props: {
    initialGroupIds?: string[]
    initialOrganisationIds?: string[]
    orderTerm?: string
    changeOrderTerm?: (term: "date" | "song" | "user") => void
    orderDescending?: boolean
    groupId?: number
    organisationId?: number
    onSubmit?: (value: (IGroupIndex | IOrganisationIndex)[]) => void
}) => {
    const {
        initialGroupIds,
        initialOrganisationIds,
        orderTerm,
        changeOrderTerm,
        orderDescending,
        onSubmit,
    } = props
    console.log("searchFilter")
    const { t } = useTranslation()
    const location = useLocation()
    const url = new URLSearchParams(location.search)

    const [groups, setGroups] = useState<IGroupIndex[] | undefined>()
    const [organisations, setorganisations] = useState<
        IOrganisationIndex[] | undefined
    >()
    const { allGroupsFetched } = useGetGroups()
    const { organisationsFetched } = useGetOrganisations()

    useEffect(() => {
        console.log("Useeffect groups")
        if (allGroupsFetched) {
            setGroups(allGroupsFetched)
        }
    }, [allGroupsFetched])
    useEffect(() => {
        console.log("Useeffect filter orgs")
        if (organisationsFetched) {
            setorganisations(organisationsFetched)
        }
    }, [organisationsFetched])

    const initialGroups = groups?.filter(
        (group) => initialGroupIds!!.indexOf(group.groupId.toString()) > -1
    )
    const initialOrganisations = organisations?.filter(
        (organisation) =>
            initialOrganisationIds!!.indexOf(
                organisation.organisationId.toString()
            ) > -1
    )
    const valuesFromIds = [
        ...(initialGroups ? initialGroups : []),
        ...(initialOrganisations ? initialOrganisations : []),
    ]

    const filterOptions = [
        ...(groups ? groups : []),
        ...(organisations ? organisations : []),
    ]

    const handleOnChange = (
        event: any,
        newValue: (IGroupIndex | IOrganisationIndex)[]
    ) => {
        if (onSubmit) {
            onSubmit(newValue)
        }
    }

    return (
        <>
            {orderTerm && changeOrderTerm && orderDescending !== undefined ? (
                <Grid item xs={12} role="row">
                    <SortingButtons
                        orderTerm={orderTerm}
                        changeOrderTerm={changeOrderTerm}
                        orderDescending={orderDescending}
                        groupId={""} //groupId}
                        organisationId={""} //organisationId}
                    />
                </Grid>
            ) : (
                <></>
            )}
            <Autocomplete
                style={{ marginBottom: "1.5em" }}
                value={valuesFromIds}
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
