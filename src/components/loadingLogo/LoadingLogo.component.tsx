import React from "react"
import { Box } from "@material-ui/core"
import { ReactComponent as Logo } from "../../assets/images/butterflyBlue.svg"
import { useTranslation } from "react-i18next"

export const LoadingLogo = () => {
    const { t } = useTranslation()

    return (
        <Box width="30%" margin="auto">
            <Logo
                aria-label={t("Dialog.loading")}
                style={{ width: "100%", height: "20%" }}
            />
        </Box>
    )
}
