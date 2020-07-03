import React, { useState } from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import DashboardButton, { DashboardButtonWithAddIcon } from "../DashboardButtons/DashboardButtons";
import colors from "../../utils/colors";

function CreateSongTab() {
    const [instruments, setInstruments] = useState([{name: "Bass", link: "/"}]);

    let addInstrument = (instrument : object) : void => {
        setInstruments(instrument => [...instruments, {name: "Instrument " + (instruments.length+1) , link: "/"}]);
    }

    return(
        <Grid container>
            <Grid item xs={"auto"} sm={1}></Grid>
            <Grid item xs={12 } sm={11}>
                <Grid container spacing={2}>
                <Grid item>
                    <DashboardButton color={colors.gray_200} text={"Partitur"} link={"/"} />
                </Grid>
                    {instruments.map((instrument) => {
                        console.log(instrument);
                        return (
                        <Grid item>
                            <DashboardButton text={instrument.name} link={instrument.link} />
                        </Grid>
                        )
                    })}
                    <Grid item>
                        <DashboardButtonWithAddIcon text={"Nytt instrument"} link={"/"} func={addInstrument} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CreateSongTab;