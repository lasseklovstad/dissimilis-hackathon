import React from "react";
import { Box, Typography } from "@material-ui/core";

export type BarProps = {

}

export const Bar: React.FC<BarProps> = props => {
    return (
        <Box>
            <Typography variant="h1">This is a bar</Typography>
        </Box>
    )
}

export default Bar;