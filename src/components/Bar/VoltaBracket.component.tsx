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
        <Box
            position="absolute"
            top="-5px"
            height={0}
            width={props.showVoltaBracketNumber ? "100%" : "calc(100% + 30px)"}
            left={props.showVoltaBracketNumber ? "0px" : "-30px"}
        >
            <Typography variant="body1" component="div">
                {props.voltaBracketOrder !== undefined && (
                    <Box className={classes.voltaBracketContainer}>
                        <Box className={`${classes.voltaBracketLine}`}>
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
