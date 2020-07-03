import React, { useState } from "react";
import { Typography, Grid } from "@material-ui/core";
import DashboardButton, { DashboardButtonWithAddIcon } from "../DashboardButtons/DashboardButtons";
import colors from "../../utils/colors";

function CreateSongTab() {
    const [instruments, setInstruments] = useState([{name: "Partitur", link: "/", selected : true}, {name: "Bass", link: "/", selected: false}]);


    return(
        <Grid container>
            <Grid item xs={"auto"} sm={1}></Grid>
            <Grid item xs={12 } sm={11}>
                <Grid container spacing={2}>
                    {instruments.map((instrument) => {
                        console.log(instrument);
                        return (
                        <Grid item>
                            <DashboardButton text={instrument.name} link={instrument.link} />
                        </Grid>
                        )
                    })}
                    <Grid item>
                     <DashboardButtonWithAddIcon text={"Nytt instrument"} link={"/"} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CreateSongTab;