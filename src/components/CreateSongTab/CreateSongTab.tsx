import React, { useState, useContext } from "react";
import { Grid, Button, Modal, TextField, makeStyles, Typography } from "@material-ui/core";
import DashboardButton, { DashboardButtonWithAddIconNoLink } from "../DashboardButtons/DashboardButtons";
import colors from "../../utils/colors";
import { useTranslation } from "react-i18next";
import { SongContext } from "../../views/SongView/SongContextProvider.component";


export type CreateSongTabProps = {

}


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: "20%",
        left: "50%",
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export type InstrumentCard = {
    name: string,
    link: string,
}
export const CreateSongTab: React.FC<CreateSongTabProps> = props => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [textFieldInput, setTextFieldInput] = useState<string>("");

    const { song: { instruments }, addInstrument } = useContext(SongContext);

    const classes = useStyles();

    const addInstrument2 = (): void => {
        addInstrument(textFieldInput);

        setModalIsOpen(false);
        setTextFieldInput("");
    }

    const handleOpen = () => {
        setModalIsOpen(true);
    };

    const handleClose = () => {
        setModalIsOpen(false);
    };

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e: any) => {
        setTextFieldInput(e.target.value);
    }

    const { t } = useTranslation();

    return (
        <Grid container>
            <Grid item xs={"auto"} sm={1}></Grid>
            <Grid item xs={12} sm={10}>
                <Grid container spacing={2}>
                    <Grid item>
                        <DashboardButton color={colors.gray_200} text={t("CreateSongTab:song")} link={"/song"} />
                    </Grid>
                    {instruments.map((instrument: string, index: number) => {
                        return (
                            <Grid item key={index}>
                                <DashboardButton text={instrument} link={"/"} />
                            </Grid>
                        )
                    })}
                    <Grid item>
                        <DashboardButtonWithAddIconNoLink text={t("CreateSongTab:newInstrument")} func={handleOpen} />
                    </Grid>
                </Grid>
            </Grid>
            <Modal open={modalIsOpen} onClose={handleClose}>
                <div className={classes.modal} style={modalStyle}>
                    <Grid container >
                        <Typography className={classes.title} variant="h2">{t("CreateSongTab:addInstrument")}</Typography>
                        <Grid item xs={12} style={{ marginBottom: "16px" }}>
                            <TextField variant="filled" onChange={handleChange} label={t("CreateSongTab:nameOfInstrument")} style={{ width: "100%" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button className={classes.button} size="large" variant="contained" disabled={textFieldInput === "" || textFieldInput === undefined || textFieldInput === null ? true : false} onClick={() => addInstrument2()} >{t("CreateSongTab:save")}</Button>
                            <Button className={classes.button} size="large" variant="outlined" onClick={() => setModalIsOpen(false)}>{t("CreateSongTab:cancel")}</Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
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