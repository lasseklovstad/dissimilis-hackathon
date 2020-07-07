import React from "react";
import { Typography, makeStyles, IconButton } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


export type MenuButtonProps = {}

export const MenuButton : React.FC<MenuButtonProps> = props => {
    const classes = useStyles();
    return(
        <div>
            <IconButton className={classes.root}>
                <MoreHorizIcon />
            </IconButton>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        backgroundColor: colors.gray_200,
        borderRadius: "50%",
        height: "48px",
        width: "48px",
        float: "right",
    }
})

export default MenuButton;