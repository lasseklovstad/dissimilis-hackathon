import React from "react"
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material"

type LoadingProps = {
    fullScreen?: boolean
    text?: string
    isLoading: boolean
}

export const Loading = (props: LoadingProps) => {
    const { text = "", fullScreen = false, isLoading } = props

    const Spinner = (
        <>
            <Box mr={1} display="flex">
                <CircularProgress size={40} />
            </Box>
            <Typography variant="caption">{text}</Typography>
        </>
    )

    if (fullScreen) {
        return (
            <Backdrop open={isLoading} style={{ zIndex: 1000 }}>
                {Spinner}
            </Backdrop>
        )
    }
    return <>{isLoading && <Box m={1}>{Spinner}</Box>}</>
}
