import React from "react"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import { makeStyles, Box } from "@material-ui/core"

const useStyles = makeStyles({
    root: {
        height: "80px",
        position: "relative",
    },
    box: {
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        msTransform: "translate(-50%,-50%)",
        transform: "translate(-50%,-50%)",
    },
    dot: {
        width: "16px",
        height: "16px",
    },
})

export const RepetitionSign = (props: {
    size: "small" | "inherit" | "large"
    display: boolean
}) => {
    const classes = useStyles()
    return (
        <Box
            className={classes.root}
            style={{
                display: props.display ? "block" : "none",
                marginRight: "2px",
            }}
        >
            <Box className={classes.box}>
                <Box>
                    <FiberManualRecordIcon className={classes.dot} />
                </Box>
                <Box>
                    <FiberManualRecordIcon className={classes.dot} />
                </Box>
            </Box>
        </Box>
    )
}
