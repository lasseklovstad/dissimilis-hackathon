import React from "react"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import { Box, makeStyles } from "@material-ui/core"

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
