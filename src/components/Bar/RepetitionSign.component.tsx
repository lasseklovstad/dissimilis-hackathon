import React from "react"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { Box } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
    dot: {
        width: "12px",
        height: "12px",
    },
})

export const RepetitionSign = (props: { display: boolean }) => {
    const classes = useStyles()
    if (!props.display) {
        return <></>
    }
    return (
        <Box
            pr={0.5}
            pl={0.5}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="160px"
            alignSelf="flex-end"
        >
            <Box>
                <FiberManualRecordIcon className={classes.dot} />
            </Box>
            <Box>
                <FiberManualRecordIcon className={classes.dot} />
            </Box>
        </Box>
    )
}
