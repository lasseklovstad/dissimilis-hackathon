import React from "react";
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from "react-i18next";


export type MenuButtonProps = {}

export const MenuButton: React.FC<MenuButtonProps> = props => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { t } = useTranslation();



    return (
        <div>
            <IconButton className={classes.root} aria-haspopup="true" onClick={handleClick} aria-label="Bar menu">
                <MoreHorizIcon />
            </IconButton>
            <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} role="menu">
                <MenuItem onClick={handleClose}>{t("MenuButton:duplicate")}</MenuItem>
                <MenuItem onClick={handleClose}>{t("MenuButton:change")}</MenuItem>
                <MenuItem onClick={handleClose}>{t("MenuButton:transpose")}</MenuItem>
                <MenuItem onClick={handleClose}>{t("MenuButton:export")}</MenuItem>
                <MenuItem onClick={handleClose}>{t("MenuButton:hide")}</MenuItem>
            </Menu>

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