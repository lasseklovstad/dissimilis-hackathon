import React from "react"
import { Box, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core"

const useStyle = makeStyles(() => {
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
        },
        houseBefore: {
            boxShadow: "-30px 0px black",
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
