import React from "react"
import { Box, Grid, Typography } from "@material-ui/core"

export const House = (props: { houseOrder: number | undefined }) => {
    return (
        <Box mb={1}>
            {props.houseOrder === undefined ? null : (
                <Grid container>
                    <Grid item xs={1} />
                    <Grid
                        item
                        xs={11}
                        style={{
                            textAlign: "left",
                            borderBottom: "2px solid black",
                        }}
                    >
                        <Typography variant="body1">
                            {`${props.houseOrder}.`}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </Box>
    )
}
