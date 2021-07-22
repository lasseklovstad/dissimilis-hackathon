import { Box, Grid, Typography } from "@material-ui/core"
import React from "react"
import { SortingButtons } from "../DashboardButtons/DashboardButtons"

export const ButtonGrid = (props: { title: string; children: any }) => {
    const { children, title } = props

    return (
        <Grid item xs={12} sm={10}>
            <Box mb={4}>
                <Box m={2}>
                    <Typography variant="h1">{title}</Typography>
                </Box>
                <Grid container spacing={3}>
                    {children.map((button: any) => (
                        <Grid item xs={12} sm={4} lg={3}>
                            {button}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Grid>
    )
}
