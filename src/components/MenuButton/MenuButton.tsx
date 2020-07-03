import React from "react";
import { Typography, makeStyles, IconButton } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles({
    root: {
        backgroundColor: colors.gray_200,
        borderRadius: "50%",
        height: "48px",
        width: "48px",
        display: "inline-block",
    },
    dots: {
        position: "absolute",
    }
})

function MenuButton() {
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <IconButton>
                <MoreHorizIcon />
            </IconButton>
        </div>
    );
};

export default MenuButton;