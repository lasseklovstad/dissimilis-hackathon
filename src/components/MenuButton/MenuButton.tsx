import React from "react";
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";


export type MenuButtonProps = {}

type MatchParams = {
    id: string
}


export const MenuButton: React.FC<MenuButtonProps> = props => {
    const classes = useStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const match = useRouteMatch<MatchParams>("/song/:id")
    let id = match ? +match.params.id : 0
    const handleClose = (method = "") => {
        setAnchorEl(null);
        if (method === "export") {
            history.push("/song/" + id + "/export");
        }
    };

    const { t } = useTranslation();



    return (
        <div>
            <IconButton className={classes.root} aria-haspopup="true" onClick={handleClick} aria-label="Bar menu">
                <MoreHorizIcon />
            </IconButton>
            <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleClose("")} role="menu">
                <MenuItem disabled onClick={() => handleClose("")}>{t("MenuButton:duplicate")}</MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>{t("MenuButton:change")}</MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>{t("MenuButton:transpose")}</MenuItem>
                <MenuItem onClick={() => handleClose("export")}>{t("MenuButton:export")}</MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>{t("MenuButton:hide")}</MenuItem>
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