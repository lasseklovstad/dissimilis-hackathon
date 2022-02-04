import { Button, Paper } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import React from "react"

export const AddBarButton = (props: { text: string; onClick: () => void }) => {
    return (
        <Paper elevation={6} sx={{ display: "flex", m: 1 }}>
            <Button
                disableFocusRipple
                size={"large"}
                startIcon={<AddIcon />}
                onClick={props.onClick}
            >
                {props.text}
            </Button>
        </Paper>
    )
}
