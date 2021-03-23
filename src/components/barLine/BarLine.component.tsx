import React from "react"
import { Box } from "@material-ui/core"

export const BarLine = () => {
    return (
        <Box
            minWidth="2px"
            width="2px"
            bgcolor="black"
            mr={0.5}
            ml={0.5}
            height="calc(100% - 17px)"
        />
    )
}
