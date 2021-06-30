import React from "react"
import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core"

const useStyle = makeStyles((theme: Theme) => {
    return {
        houseContainer: {
            display: "flex",
            justifyContent: "flex-end",
            lineHeight: "0",
        },
        houseLine: {
            textAlign: "left",
            borderBottom: "2px solid black",
            width: "100%",
            lineHeight: 0,
        },
        houseBefore: {
            "&:before": {
                width: "30px",
                content: "' '",
                display: "table-cell",
                borderBottom: "2px solid black",
                position: "relative",
                left: "-30px",
                bottom: "-2px",
            },
        },
    }
})

export const House = (props: {
    houseOrder: number | undefined | null
    showHouseNumber: boolean
}) => {
    const classes = useStyle()

    if (!props.houseOrder) {
        return <></>
    }

    const getHouseNumber = () => {
        if (props.showHouseNumber) {
            return `${props.houseOrder}.`
        }
        return ""
    }

    return (
        <Box position="relative" top="-5px" height={0}>
            <Typography variant="body1" component="div">
                {props.houseOrder === undefined ? null : (
                    <Box className={classes.houseContainer}>
                        <Box
                            className={`${classes.houseLine} ${
                                props.showHouseNumber ? "" : classes.houseBefore
                            }`}
                        >
                            <span
                                style={{ position: "relative", top: "-10px" }}
                            >
                                {getHouseNumber()}
                            </span>
                        </Box>
                    </Box>
                )}
            </Typography>
        </Box>
    )
}
