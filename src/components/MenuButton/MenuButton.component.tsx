import React, { useContext } from "react";
import { makeStyles, IconButton, Menu, MenuItem } from "@material-ui/core";
import colors from "../../utils/colors";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { usePutSong } from "../../utils/usePutSong";
import { SongToolsContext } from "../../views/SongView/SongToolsContextProvider.component";


export type MenuButtonProps = {}

type MatchParams = {
    id: string
}


export const MenuButton: React.FC<MenuButtonProps> = props => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const { song, setIsSaving } = useContext(SongContext);
    const { setShowPossiblePositions } = useContext(SongToolsContext);

    const { t } = useTranslation();
    const history = useHistory();
    const putSong = usePutSong(song);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const match = useRouteMatch<MatchParams>("/song/:id")
    let id = match ? +match.params.id : 0;

    const handleClose = (method = "") => {
        setAnchorEl(null);
        switch (method) {
            case "export":
                setShowPossiblePositions(false);
                putSong().then(() => {
                    history.push("/song/" + id + "/export");
                })

                break;
            case "save":
                putSong().then(() => {
                    setIsSaving(true);
                })
                break;
            default:
        }
    };


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