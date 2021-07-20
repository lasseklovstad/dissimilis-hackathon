import React from "react"
import Chip from "@material-ui/core/Chip"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { DashboardLibraryButton } from "../DashboardButtons/DashboardButtons"
import { GroupFilter, useGetGroups } from "../../utils/useApiServiceGroups"
import { Grid } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => ({
    inputField: {
        width: "100%",
    },
}))

export const SongFilterButton = () => {
    const classes = useStyles()
    const { getAllGroups } = useGetGroups(GroupFilter.Admin)
    const getGroups () => {
    
            if (Array.isArray(getAllGroups)) {
                return (
                    <>
                        {getAllGroups.map((group, i) => {
                            return (
                                <DashboardLibraryButton key={i} text={group.} link={} />
                            )
                        })}
                    </>
                )
            }
    
    }


    return (
        <Grid item xs={12} className={classes.inputField}>
            <DashboardLibraryButton
                text="hei"
                link="/dashboard"
            />
        </Grid>
      
    )
}
