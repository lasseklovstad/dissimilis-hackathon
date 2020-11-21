import React from "react"
import { Box } from "@material-ui/core"
import animatedBird from "../../assets/images/sommerfugl-animert.svg"

export const LoadingLogo = () => {
    return (
        <Box width="30%" margin="auto">
            <object
                type="image/svg+xml"
                data={animatedBird}
                aria-label="Loading"
                style={{ width: "100%", height: "20%" }}
            />
        </Box>
    )
}
