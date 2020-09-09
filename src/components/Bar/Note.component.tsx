import React from "react"
import { Box, makeStyles } from "@material-ui/core"
import { getColor } from "./BarBody.component"

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
    },
    box: {
        borderRadius: "5px",
        flex: 1,
        margin: "2px",
    },
})

export const Note = (props: { notes: string[] }) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            {props.notes.map((note) => {
                return (
                    <Box
                        className={classes.box}
                        style={{ backgroundColor: getColor(note) }}
                    />
                )
            })}
        </div>
    )
}
