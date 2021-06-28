import React from "react"
import { Box, Typography } from "@material-ui/core"

export const House = (props: {
    houseOrder: number | undefined | null
    showHouseNumber: boolean
}) => {
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
                    <Box                  
                        display="flex"
                        justifyContent="flex-end"
                        height={0}
                    >
                        <Box
                            height={0}
                            flexGrow={2}
                            style={{
                                textAlign: "left",
                                borderBottom: "2px solid black",
                                lineHeight: 0,
                            }}
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
