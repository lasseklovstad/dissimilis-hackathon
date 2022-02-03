import React from "react"
import { Box, Theme, Typography } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"

const useStyle = makeStyles((theme: Theme) => {
    return {
        voltaBracketContainer: {
            display: "flex",
            justifyContent: "flex-end",
            lineHeight: "0",
        },
        voltaBracketLine: {
            textAlign: "left",
            borderBottom: "2px solid black",
            width: "100%",
            lineHeight: 0,
        },
        voltaBracketBefore: {
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

export const VoltaBracket = (props: {
    voltaBracketOrder: number | undefined | null
    showVoltaBracketNumber: boolean
}) => {
    const classes = useStyle()

    if (!props.voltaBracketOrder) {
        return null
    }

    const getVoltaBracketNumber = () =>
        props.showVoltaBracketNumber ? `${props.voltaBracketOrder}.` : ""

    return (
        <Box position="relative" top="-5px" height={0}>
            <Typography variant="body1" component="div">
                {props.voltaBracketOrder !== undefined && (
                    <Box className={classes.voltaBracketContainer}>
                        <Box
                            className={`${classes.voltaBracketLine} ${
                                props.showVoltaBracketNumber
                                    ? ""
                                    : classes.voltaBracketBefore
                            }`}
                        >
                            <span
                                style={{ position: "relative", top: "-10px" }}
                            >
                                {getVoltaBracketNumber()}
                            </span>
                        </Box>
                    </Box>
                )}
            </Typography>
        </Box>
    )
}
