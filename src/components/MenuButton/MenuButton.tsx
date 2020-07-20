import React from "react";
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";


export type MenuButtonProps = {}

export const MenuButton: React.FC<MenuButtonProps> = props => {
    const classes = useStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (method = "") => {
        setAnchorEl(null);
        if (method === "export") {
            history.push("/song/1/export");
        }
    };

    const { t } = useTranslation();



    return (
        <div>
            <IconButton className={classes.root} aria-haspopup="true" onClick={handleClick} aria-label="Bar menu">
                <MoreHorizIcon />
            </IconButton>
            <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleClose("")} role="menu">
                <MenuItem onClick={() => handleClose("")}>{t("MenuButton:duplicate")}</MenuItem>
                <MenuItem onClick={() => handleClose("")}>{t("MenuButton:change")}</MenuItem>
                <MenuItem onClick={() => handleClose("")}>{t("MenuButton:transpose")}</MenuItem>
                <MenuItem onClick={() => handleClose("export")}>{t("MenuButton:export")}</MenuItem>
                <MenuItem onClick={() => handleClose("")}>{t("MenuButton:hide")}</MenuItem>
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