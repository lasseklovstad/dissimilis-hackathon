import React from "react"
import { Box, Typography } from "@material-ui/core"
import { colors } from "../../utils/colors"
import { ITimeSignature } from "../../models/ITimeSignature"
import { useTranslation } from "react-i18next"

export const TimeSignature = (props: { timeSignature: ITimeSignature }) => {
    const { t } = useTranslation()
    return (
        <Typography
            variant="body1"
            component="div"
            aria-label={t("Song.timeSignature")}
        >
            <Box fontWeight="fontWeightBold" width="30px">
                <Box lineHeight={1} height={24}>
                    {props.timeSignature.numerator}
                </Box>
                <span hidden>/</span>
                <Box lineHeight={1} height={24}>
                    {props.timeSignature.denominator}
                </Box>
            </Box>
        </Typography>
    )
}

export const BarNumber = (props: { barNumber: number }) => {
    const { t } = useTranslation()
    return (
        <Box
            width="30px"
            color={colors.gray_400}
            aria-label={t("Song.barNumber")}
        >
            <Typography variant="body1">{props.barNumber}</Typography>
        </Box>
    )
}
