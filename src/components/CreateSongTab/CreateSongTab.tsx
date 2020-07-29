import React, { useState, useContext } from "react";
import { Grid, Button, Modal, TextField, makeStyles, Typography, Menu, MenuItem } from "@material-ui/core";
import { DashboardButtonWithAddIconNoLink, DashboardButtonNoLink, DashboardButton } from "../DashboardButtons/DashboardButtons";
import colors from "../../utils/colors";
import { useTranslation } from "react-i18next";
import { SongContext } from "../../views/SongView/SongContextProvider.component";
import { IVoice } from "../../models/IVoice";
import { useHistory } from "react-router-dom";
import { CustomModal } from "../CustomModal/CustomModal";

export type CreateSongTabProps = {

}

function getModalStyle() {
    const left = 50;

    return {
        top: "20%",
        left: "50%",
        transform: `translate(-${left}%)`,
    };
}

export type InstrumentCard = {
    name: string,
    link: string,
}
export const CreateSongTab: React.FC<CreateSongTabProps> = props => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [renameModalIsOpen, setRenameModalIsOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [textFieldInput, setTextFieldInput] = useState<string>("");

    const history = useHistory();

    const { song: { voices }, addVoice, changeVoiceTitle, song } = useContext(SongContext);

    const classes = useStyles();

    const handleAddInstrument = () => {
        addVoice({ title: textFieldInput, partNumber: voices.length, bars: [] });
        setModalIsOpen(false);
        setTextFieldInput("");
        const newIndex = voices.length + 1;
        history.replace("?voice=" + newIndex.toString());
    };

    const handleOpen = () => {
        setModalIsOpen(true);
    };

    const handleClose = () => {
        setModalIsOpen(false);
        setRenameModalIsOpen(false);
    };

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
        setTextFieldInput(e.target.value);
    };

    const { t } = useTranslation();
    const queryString = require('query-string');
    const voiceString = queryString.parse(window.location.search);
    const selectedVoice = parseInt(voiceString.voice);
    const [rightClicked, setRightClicked] = useState(-1);


    const initialState = {
        mouseX: null,
        mouseY: null,
    };

    const [rightClickCoordinates, setRightClickCoordinates] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialState);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setRightClickCoordinates({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    const handleCloseMenu = (method?: string) => {
        if (method === "renameVoice") {
            setRenameModalIsOpen(true)
        }
        setRightClickCoordinates(initialState);
    };
    const handleChangeVoiceTitle = () => {
        setRenameModalIsOpen(false);
        changeVoiceTitle(rightClicked + 1, textFieldInput)
    }

    const CHARACTER_LIMIT = 250;

    return (
        <Grid container>
            <Grid item xs={"auto"} sm={1}></Grid>
            <Grid item xs={12} sm={10}>
                <Grid container spacing={2}>
                    <Grid item>
                        <DashboardButtonNoLink selected={selectedVoice === 1} text={t("CreateSongTab:song")} func={() => { history.replace(`/song/${song.id}?voice=1`) }} />
                    </Grid>
                    {voices.slice(1).map((voices: IVoice, index: number) => {
                        return (
                            <Grid item key={index}>
                                <DashboardButton onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { setRightClicked(index); handleClick(e) }} selected={selectedVoice === index + 2} text={voices.title} link={`/song/1?voice=${index + 2}`} />
                                <Menu
                                    keepMounted
                                    open={rightClickCoordinates.mouseY !== null}
                                    onClose={() => { handleCloseMenu("") }}
                                    anchorReference="anchorPosition"
                                    anchorPosition={
                                        rightClickCoordinates.mouseY !== null && rightClickCoordinates.mouseX !== null
                                            ? { top: rightClickCoordinates.mouseY, left: rightClickCoordinates.mouseX }
                                            : undefined
                                    }
                                >
                                    <MenuItem onClick={() => { handleCloseMenu("renameVoice") }}>{t("CreateSongTab:changeVoiceName")}</MenuItem>
                                </Menu>
                            </Grid>
                        )
                    })}
                    <Grid item>
                        <DashboardButtonWithAddIconNoLink text={t("CreateSongTab:newInstrument")} func={handleOpen} />
                    </Grid>
                </Grid>
            </Grid>
            <CustomModal handleOnCancelClick={() => handleClose}
                handleOnSaveClick={() => handleAddInstrument}
                handleClosed={() => handleClose}
                modalOpen={modalIsOpen}
                saveText={t("CreateSongTab:save")}
                cancelText={t("CreateSongTab:cancel")}
                headerText={t("CreateSongTab:addInstrument")}
                labelText={t("CreateSongTab:nameOfInstrument")}
                handleChange={() => handleChange}
                textFieldInput={textFieldInput} />
            <CustomModal handleOnCancelClick={() => handleClose}
                handleOnSaveClick={() => handleChangeVoiceTitle}
                handleClosed={() => () => setRenameModalIsOpen(false)}
                modalOpen={renameModalIsOpen}
                saveText={t("CreateSongTab:saveNewName")}
                cancelText={t("CreateSongTab:cancel")}
                headerText={t("CreateSongTab:changeVoiceName")}
                labelText={t("CreateSongTab:newVoiceName")}
                handleChange={() => handleChange}
                textFieldInput={textFieldInput} />

            {/* <Modal open={renameModalIsOpen} onClose={handleClose}>
                <div className={classes.modal} style={modalStyle}>
                    <Grid container >
                        <Typography className={classes.title} variant="h2">{t("CreateSongTab:changeVoiceName")}</Typography>
                        <Grid item xs={12} style={{ marginBottom: "16px" }}>
                            <TextField variant="filled" autoFocus onChange={handleChange} label="Navn" style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button className={classes.button} size="large" variant="contained" disabled={!textFieldInput} onClick={handleChangeVoiceTitle} >{t("CreateSongTab:saveNewName")}</Button>
                            <Button className={classes.button} size="large" variant="outlined" onClick={() => setRenameModalIsOpen(false)}>{t("CreateSongTab:cancel")}</Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
 */}
            <Grid item xs={"auto"} sm={1}></Grid>
        </Grid>
    );
};


const useStyles = makeStyles({
    modal: {
        position: 'absolute',
        boxShadow: '0 3px 6px 2px rgba(0, 0, 0, 0.1)',
        height: "auto",
        borderRadius: 2,
        backgroundColor: "white",
        padding: "40px",
        "@media (max-width: 600px)": {
            width: "80%",
            padding: "48px",
        },
        outline: "none",
    },
    button: {
        "&:hover": {
            backgroundColor: colors.gray_300
        },
        marginRight: "8px",
        float: "left",
        position: "relative",
    },
    title: {
        padding: "8px",
    }
})

export default CreateSongTab;