import React, { useState } from "react"
import { Box, Grid, makeStyles, Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useHistory } from "react-router"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { ErrorDialog } from "../../components/errorDialog/ErrorDialog.component"

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
})

export const AdminView = () => {
    const styles = useStyles()
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const history = useHistory()

    const { getUser, userInit } = useGetUser()
    const userId = userInit?.userId

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/library`)
    }

    const userIsSystemAdmin = (userId: number | undefined) => {
        return true
    }

    const userIsCountryAdmin = (userId: number | undefined) => {
        return true
    }

    const userIsGroupAdmin = (userId: number | undefined) => {
        return true
    }

    const userIsNotElevated = (userId: number | undefined) => {
        return (
            !userIsSystemAdmin(userId) &&
            !userIsCountryAdmin(userId) &&
            !userIsGroupAdmin(userId)
        )
    }

    return (
        <>
            <Box mx={2}>
                <Grid container justify="center" className={styles.container}>
                    <Grid item xs={12}>
                        <DashboardTopBar
                            onChange={handleOnChangeSearch}
                            searchTerm={searchTerm}
                        />
                        <Typography variant="h1">
                            {t("AdminView.adminPanel")}
                        </Typography>
                        This is the adminView
                        <Typography variant="h2">
                            {userIsSystemAdmin(userId) ? "System Admin" : ""}
                        </Typography>
                        <Typography variant="h2">
                            {userIsCountryAdmin(userId) ? "Country Admin" : ""}
                        </Typography>
                        <Typography variant="h2">
                            {userIsGroupAdmin(userId) ? "Group Admin" : ""}
                        </Typography>
                        <Typography variant="h2">
                            {userIsNotElevated(userId)
                                ? "You do not have permissions to view this page"
                                : ""}
                        </Typography>
                        {
                            //<SystemSettings></SystemSettings> ?
                            //<CountryGrid></CountryGrid> ?
                            //<GroupGrid></GroupGrid> ?
                        }
                        <ErrorDialog
                            error={getUser.error}
                            isError={getUser.isError}
                            title="There was an error fetching the user access level"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
