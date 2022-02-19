import { Box } from "@mui/material"
import React, { ReactNode } from "react"

type ChordContainerProps = {
    children?: ReactNode
    chordLength: number
}
export const ChordContainer = (props: ChordContainerProps) => {
    const { chordLength, children } = props
    return (
        <Box
            flexGrow={chordLength}
            display="flex"
            flexDirection="column"
            position="relative"
            height="100%"
            justifyContent="flex-end"
            flexBasis="0"
            mr={0.5}
            ml={0.5}
            minWidth={0}
            textAlign="left"
        >
            {children}
        </Box>
    )
}
