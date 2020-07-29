import React, { useContext } from "react";
import { makeStyles, IconButton, Menu, MenuItem, Switch } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { usePutSong } from "../../utils/usePutSong";


export type MenuButtonProps = {}

export const MenuButton: React.FC<MenuButtonProps> = props => {
    const classes = useStyles();
    const history = useHistory();
    const { song } = useContext(SongContext);
    const putSong = usePutSong(song);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (method = "") => {
        setAnchorEl(null);
        switch (method) {
            case "export":
                history.push("/song/1/export");
                break;
            case "save":
                putSong();
                break;
            default:

        }
    };

    const { t } = useTranslation();

    return (
        <div>
            <IconButton className={classes.root} aria-haspopup="true" onClick={handleClick} aria-label="Bar menu">
                <MoreHorizIcon />
            </IconButton>
            <Menu id="menuBar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleClose("")} role="menu">
                <MenuItem onClick={() => handleClose("save")}>{t("MenuButton:save")}</MenuItem>
                <MenuItem disabled onClick={() => handleClose("")}>{t("MenuButton:duplicate")}</MenuItem>
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