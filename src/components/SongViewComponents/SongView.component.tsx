import React, { FC, useContext } from "react"
import { makeStyles, Box, Typography } from "@material-ui/core"
import { colors } from "../../utils/colors"
import { SongContext } from "../../views/SongView/SongContextProvider.component"

export const TimeSignature = (props: { timeSignature: string }) => {
    const timeSignatureString = props.timeSignature
    const timeSignatureNumerator = timeSignatureString.split("/")[0]
    const timeSignatureDenominator = timeSignatureString.split("/")[1]

    return (
        <Typography variant="body1">
            <Box mr={1} fontWeight="fontWeightBold">
                <Box>{timeSignatureNumerator}</Box>
                <Box>{timeSignatureDenominator}</Box>
            </Box>
        </Typography>
    )
}

export const BarNumber = (props: { barNumber: number }) => {
    return (
        <Box mr={1}>
            <Typography variant="body1">{props.barNumber}</Typography>
        </Box>
    )
}
