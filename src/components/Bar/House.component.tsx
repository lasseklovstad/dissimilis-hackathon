import React from "react"
import { Box, Typography } from "@material-ui/core"

export const House = (props: { houseOrder: number | undefined }) => {
    return (
        <Box position="relative" top="-20px" height={0}>
            <Typography variant="body1" component="div">
                {props.houseOrder === undefined ? null : (
                    <Box
                        ml={4}
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
                            >{`${props.houseOrder}.`}</span>
                        </Box>
                    </Box>
                )}
            </Typography>
        </Box>
    )
}
