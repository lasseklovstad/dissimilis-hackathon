import React, { useState } from "react"
import { Box, Grid, makeStyles, Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { DashboardTopBar } from "../../components/DashboardTopBar/DashboardTopBar"
import { useHistory } from "react-router"

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

    const handleOnChangeSearch = (searchTermParam: string) => {
        // Temporary placeholder
        setSearchTerm(searchTermParam)
        history.push(`/libraryView`)
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
                        {/*
                        {userHasElevatedPermissions(user) ? (
                            <SystemSettings></SystemSettings> ?
                            <CountryGrid></CountryGrid> ?
                            <GroupGrid></GroupGrid> ?
                        ) : (
                            <ErrorDialog></ErrorDialog>
                            Insufficient user access level!
                        )}
                        */}
                        <Typography variant="h2">
                            {t("AdminView.adminPanel")}
                        </Typography>
                        This is the adminView
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
