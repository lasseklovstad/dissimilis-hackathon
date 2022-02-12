import { Grid } from "@mui/material"
import { useTranslation } from "react-i18next"
import { IGroupIndex } from "../../models/IGroup"
import { SortingButtons } from "../DashboardButtons/DashboardButtons"
import { GroupAutocomplete } from "../GroupAutocomplete/GroupAutocomplet.component"

export const SearchFilterAutocomplete = (props: {
    initialGroupIds: string[]
    orderTerm?: string
    changeOrderTerm?: (term: "date" | "song" | "user") => void
    orderDescending?: boolean
    onSubmit: (value: IGroupIndex[]) => void
}) => {
    const {
        initialGroupIds,
        orderTerm,
        changeOrderTerm,
        orderDescending,
        onSubmit,
    } = props
    const { t } = useTranslation()

    return (
        <>
            <GroupAutocomplete
                selectedGroups={initialGroupIds}
                label={t<string>("DashboardView.autoCompleteLabel")}
                onGroupChange={onSubmit}
            />
            {orderTerm && changeOrderTerm && orderDescending !== undefined ? (
                <Grid item xs={12} role="row">
                    <SortingButtons
                        orderTerm={orderTerm}
                        changeOrderTerm={changeOrderTerm}
                        orderDescending={orderDescending}
                    />
                </Grid>
            ) : (
                <></>
            )}
        </>
    )
}
