import React from "react"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { Box } from "@mui/material"

const dotStyle = {
    width: "12px",
    height: "12px",
}

export const RepetitionSign = (props: { display: boolean }) => {
    if (!props.display) {
        return <></>
    }
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="160px"
            alignSelf="flex-end"
        >
            <Box>
                <FiberManualRecordIcon sx={dotStyle} />
            </Box>
            <Box>
                <FiberManualRecordIcon sx={dotStyle} />
            </Box>
        </Box>
    )
}
