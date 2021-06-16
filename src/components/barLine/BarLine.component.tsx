import React from "react"
import { Box } from "@material-ui/core"

export const BarLine = (props: { lastPosition?: boolean }) => {
    return (
        <Box
            minWidth="2px"
            width="2px"
            bgcolor="black"
            mr={1.5}
            ml={props.lastPosition ? 0 : 1.5}
            height="calc(100% - 17px)"
        />
    )
}
