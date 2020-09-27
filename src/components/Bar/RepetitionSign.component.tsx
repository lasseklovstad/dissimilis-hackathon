import React from "react"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import { makeStyles, Box } from "@material-ui/core"

const useStyles = makeStyles({
    dot: {
        width: "16px",
        height: "16px",
    },
})

export const RepetitionSign = (props: { display: boolean }) => {
    const classes = useStyles()
    if (!props.display) {
        return <></>
    }
    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
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
