import React from "react"
import { Box, Typography } from "@material-ui/core"
import { colors } from "../../utils/colors"
import { ITimeSignature } from "../../models/ITimeSignature"

export const TimeSignature = (props: { timeSignature: ITimeSignature }) => {
    return (
        <Typography variant="body1" component="div">
            <Box mr={1} fontWeight="fontWeightBold" width="30px">
                <Box>{props.timeSignature.numerator}</Box>
                <Box>{props.timeSignature.denominator}</Box>
            </Box>
        </Typography>
    )
}

export const BarNumber = (props: { barNumber: number }) => {
    return (
        <Box mr={1} width="30px" color={colors.gray_400}>
            <Typography variant="body1">{props.barNumber}</Typography>
        </Box>
    )
}
