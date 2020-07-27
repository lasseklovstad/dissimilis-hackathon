import React, { useContext, useState, useEffect } from "react";
import { Box, makeStyles, Typography, Grid, Slider, Button, BottomNavigation } from "@material-ui/core";
import { SongContext } from "../SongView/SongContextProvider.component";
import colors from "../../utils/colors";
import BarContainer from "../../components/BarContainer/BarContainer.component";
import { IBar } from "../../models/IBar";
import { useHistory } from "react-router-dom";
import BarNumber, { TimeSignature } from "../../components/SongViewComponents/SongView.component";


export type ExportViewProps = {
}

export const ExportView: React.FC<ExportViewProps> = props => {
    //Oppklaring:
    //Bør man ha mulighet til å overskride A4 / eller få beskjed når dette går


    //TODO
    // Legge til automatisk oppsett slik at man automatisk får det "beste" oppsettet. 
    //  Altså har du 4 takter, så vil det automatisk være 2 rader med 2 takter på hver?
    //Se på når det er flere stemmer. AKk nå vil boksen bli lengre og lengre


    const { song: { title, voices } } = useContext(SongContext);
    const classes = useStyles();
    const history = useHistory();



    const [rowsPerSheet, setRowsPerSheet] = useState<number>(4);
    const [lengthOfEachBar, setlengthOfEachBar] = useState<1 | 2 | 3 | 4 | 6 | 12>(3);
    const [amountOfPages, setAmountOfPages] = useState<number>(1);


    const queryString = require('query-string');

    const voiceString = queryString.parse(window.location.search);
    let selectedVoice = 0;
    if (voiceString.voice !== undefined) {
        const voiceInt = parseInt(voiceString.voice);
        if (voiceInt > voices.length || voiceInt <= 0) {
            history.replace(`/song/${1}/export?voice=1`);
        } else {
            selectedVoice = voiceString.voice - 1;
        }
    } else {
        history.replace(`/song/${1}/export?voice=1`);
    }

    //Endre denne slik at alt skjer i slideren
    const changeAmount = (amount: number | number[]) => {
        if (amount === 1) {
            setlengthOfEachBar(12)
        } else if (amount === 2) {
            setlengthOfEachBar(6)
        } else if (amount === 4) {
            setlengthOfEachBar(3)
        } else if (amount === 6) {
            setlengthOfEachBar(2)
        } else {
            setlengthOfEachBar(1);
        }
    }

    //Used because slider returns a number | number[]
    const changeRowsPerSheet = (amount: number | number[]) => {
        if (amount === 1) {
            setRowsPerSheet(1)
        } else if (amount === 2) {
            setRowsPerSheet(2)
        } else if (amount === 3) {
            setRowsPerSheet(3)
        } else if (amount === 4) {
            setRowsPerSheet(4)
        } else if (amount === 5) {
            setRowsPerSheet(5)
        } else {
            setRowsPerSheet(1);
        }
    }

    const number = 770;
    const calculateHeightOfBar = () => {
        if (rowsPerSheet === 1) return number
        if (rowsPerSheet === 2) return number / 2
        if (rowsPerSheet === 3) return number / 3 - 10
        if (rowsPerSheet === 4) return number / 4 - 40
        if (rowsPerSheet === 5) return number / 5 - 20
        return 120
    }

    const marks = [
        {
            value: 1,
        },
        {
            value: 2,
        },
        {
            value: 4,
        },
        {
            value: 6,
        },
        {
            value: 12,
        },
    ];

    const isBarLineBefore = (index: number) => {

        if (lengthOfEachBar === 12) {
            return true;
        }
        if (index === 0) return true;
        if (lengthOfEachBar === 6 && index % 2 === 0) return true;
        if (lengthOfEachBar === 3 && index % 4 === 0) return true;
        if (lengthOfEachBar === 2 && index % 6 === 0) return true;
        if (lengthOfEachBar === 1 && index % 12 === 0) return true;
        return false;
    }

    const isBarLineAfter = (index: number) => {
        if (index === voices[selectedVoice].bars.length - 1) return true;
        return false;
    }

    const convertFromLengthOfBarToAmountOfBarsPerRow = (): number => {
        let lengthOfEachBarCalculated = 1;
        switch (lengthOfEachBar) {
            case 1:
                lengthOfEachBarCalculated = 12;
                break;
            case 2:
                lengthOfEachBarCalculated = 6;
                break;
            case 3:
                lengthOfEachBarCalculated = 4;
                break;
            case 4:
                lengthOfEachBarCalculated = 3;
                break;
            case 6:
                lengthOfEachBarCalculated = 2;
                break;
            case 12:
                lengthOfEachBarCalculated = 1;
                break;
            default:
                lengthOfEachBarCalculated = 1;
        }
        return lengthOfEachBarCalculated;
    }


    const calculatePage = () => {

        const amountOfBars = voices[selectedVoice].bars.length;
        let lengthOfEachBarCalculated = convertFromLengthOfBarToAmountOfBarsPerRow();

        const totalRowsUsed = Math.ceil(amountOfBars / lengthOfEachBarCalculated);
        const heightOfDiv = totalRowsUsed * calculateHeightOfBar()

        const amountOfPages1 = Math.ceil(heightOfDiv / 770);
        setAmountOfPages(amountOfPages1);




    }

    useEffect(() => {
        calculatePage();

    }, [rowsPerSheet, lengthOfEachBar])






    return (
        <>
            {Array.from(Array(amountOfPages), (e, i) => {
                //Beregn antall per side
                return (
                    <Box className={classes.root + " page"}>
                        <Grid container >
                            <Grid item xs={12}>
                                <Typography style={{ textAlign: "center" }} variant="h1">{title + " " + (i + 1) + "/" + amountOfPages}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                {voices[selectedVoice].bars.map((bar, index) => {
                                    console.log(index);
                                    const amountOfBarsPerRow = convertFromLengthOfBarToAmountOfBarsPerRow();
                                    const indexToBeDisplayed = (index + 1) + (amountOfBarsPerRow * rowsPerSheet * i);
                                    //(index + (amountOfBarsPerRow * rowsPerSheet * i)) < (rowsPerSheet * amountOfBarsPerRow) * (i + 1)
                                    if (indexToBeDisplayed <= (i + 1) * amountOfBarsPerRow * rowsPerSheet) {
                                        if (indexToBeDisplayed <= voices[selectedVoice].bars.length) {
                                            if (i === 0 && index === 0) {
                                                return (<TimeSignature height={calculateHeightOfBar()} />)
                                            } else if (index % amountOfBarsPerRow === 0) {
                                                return (<BarNumber height={calculateHeightOfBar()} key={index} barNumber={indexToBeDisplayed} />)
                                            } else {
                                                return (<></>)
                                            }
                                        }
                                    }
                                })}
                            </Grid>

                            <Grid item xs={11}>
                                <Grid container>
                                    {voices[selectedVoice].bars.length === 0 ?
                                        <></>
                                        :
                                        <>
                                            {voices[selectedVoice].bars.slice(i * (rowsPerSheet * convertFromLengthOfBarToAmountOfBarsPerRow()), (i + 1) * rowsPerSheet * convertFromLengthOfBarToAmountOfBarsPerRow()).map((bar, i) => {
                                                return (
                                                    <>
                                                        <Grid item xs={lengthOfEachBar}  >
                                                            <BarContainer height={calculateHeightOfBar()} voiceId={selectedVoice} barNumber={i} masterSheet={false} barLineAfter={isBarLineAfter(i)} barLineBefore={isBarLineBefore(i)} bar={bar} />
                                                        </Grid>
                                                    </>

                                                )
                                            })}
                                        </>
                                    }


                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )
            })}


            <BottomNavigation className={classes.stickToBottom + " no-print"}>
                <Box mx={"24px"} mt={"24px"} style={{ display: "flex", width: "100%", height: "100%" }}>
                    <Box style={{ height: "100%", display: "flex" }}>
                        {voices.map((voice, i) => {
                            return <Button onClick={() => history.replace("/song/1/export?voice=" + (i + 1))} style={{ backgroundColor: selectedVoice === i ? colors.gray_400 : "white" }} className={classes.button} variant="outlined">{voice.title}</Button>
                        })}
                    </Box>

                    <Box style={{ flex: 2, marginLeft: "8px", marginRight: "8px" }}>
                        <Typography variant="body1">Takt per rad</Typography>
                        <Slider onChange={(event, value) => changeAmount(value)} defaultValue={4} step={null} marks={marks} min={1} max={6} valueLabelDisplay="auto" />
                    </Box>
                    <Box style={{ flex: 2 }}>
                        <Typography variant="body1">Rader per ark</Typography>
                        <Slider onChange={(event, value) => changeRowsPerSheet(value)} defaultValue={4} step={1} marks min={1} max={5} valueLabelDisplay="auto" />
                    </Box>
                    <Button onClick={() => window.print()} style={{ marginLeft: "12px", backgroundColor: colors.gray_400, height: "100%" }}>Lag PDF</Button>
                    <Button onClick={() => history.push("/song/1/")}> {"Avbryt"}</Button>
                </Box>
            </BottomNavigation>

        </ >


    )

}



const useStyles = makeStyles({
    root: {
        border: "1px solid black",
        "@media print": {
            border: "none"
        }
    },
    button: {
        backgroundColor: colors.gray_100,
        marginRight: "4px",
        marginBottom: "4px",
        borderRadius: "4px",
        border: "1px solid #E0E0E0",
        height: "100%",
        flex: 1,
    },
    slider: {
        border: "1px solid black",
    },
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        marginBottom: "60px",
    },
})

export default ExportView;