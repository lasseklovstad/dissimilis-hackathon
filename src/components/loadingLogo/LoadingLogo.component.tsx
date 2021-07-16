import React from "react"
import { Box } from "@material-ui/core"
import animatedBird from "../../assets/images/sommerfugl-animert.svg"
import { useTranslation } from "react-i18next"

export const LoadingLogo = () => {
    const { t } = useTranslation()
    return (
        <Box width="30%" margin="auto">
            <object
                type="image/svg+xml"
                data={animatedBird}
                aria-label={t("Dialog.loading")}
                style={{ width: "100%", height: "20%" }}
            />
        </Box>
    )
}
