import React, { useContext, useState, useEffect } from "react";
import { Box, makeStyles, Typography, Grid, Slider, Button, BottomNavigation, FormControl, Select, MenuItem, useMediaQuery } from "@material-ui/core";
import { SongContext } from "../SongView/SongContextProvider.component";
import colors from "../../utils/colors";
import BarContainer from "../../components/BarContainer/BarContainer.component";
import { useHistory } from "react-router-dom";
import BarNumber, { TimeSignature } from "../../components/SongViewComponents/SongView.component";
import { useTranslation } from "react-i18next";


export type ExportViewProps = {
}

export const ExportView: React.FC<ExportViewProps> = props => {
    const { song: { title, voices, id } } = useContext(SongContext);
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation();



    const [rowsPerSheet, setRowsPerSheet] = useState<number>(4);
    const [lengthOfEachBar, setlengthOfEachBar] = useState<1 | 2 | 3 | 4 | 6 | 12>(3);
    const [amountOfPages, setAmountOfPages] = useState<number>(1);
    const [dropDownMenuSelected, setDropDownMenuSelected] = useState<number>(0);


    const queryString = require('query-string');

    const voiceString = queryString.parse(window.location.search);
    let selectedVoice = 0;
    if (voiceString.voice !== undefined) {
        const voiceInt = parseInt(voiceString.voice);
        if (voiceInt > voices.length || voiceInt <= 0) {
            history.replace("./export?voice=1");
        } else {
            selectedVoice = voiceString.voice - 1;
        }
    } else {
        history.replace("./export?voice=1");
    }

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
        if (rowsPerSheet === 2) return number / 2 - 10
        if (rowsPerSheet === 3) return number / 3 - 20
        if (rowsPerSheet === 4) return number / 4 - 50
        if (rowsPerSheet === 5) return number / 5 - 30
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

    const isBarLineAfter = (page: number, index: number) => {
        if (index === voices[selectedVoice].bars.length) return true;
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
        if (amountOfPages1 === 0) {
            setAmountOfPages(1);
        } else {
            setAmountOfPages(amountOfPages1);
        }
    }

    useEffect(() => {
        calculatePage();
    }, [rowsPerSheet, lengthOfEachBar])


    const handleChange = (event: any) => {
        setDropDownMenuSelected(event.target.value);
    }
    const matches = useMediaQuery("(min-width:960px)");
    return (
        <>
            {Array.from(Array(amountOfPages), (e, pageIndex) => {
                return (
                    <Box className={classes.root + " page"}>
                        <Grid container >
                            <Grid item xs={12}>
                                <Typography style={{ textAlign: "center" }} variant="h1">{title}</Typography>
                                <Typography style={{ textAlign: "center" }} variant="body1">{voices[selectedVoice].title}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                {voices[selectedVoice].bars.map((bar, index) => {
                                    const amountOfBarsPerRow = convertFromLengthOfBarToAmountOfBarsPerRow();
                                    const indexToBeDisplayed = (index + 1) + (amountOfBarsPerRow * rowsPerSheet * pageIndex);
                                    if (indexToBeDisplayed <= (pageIndex + 1) * amountOfBarsPerRow * rowsPerSheet) {
                                        if (indexToBeDisplayed <= voices[selectedVoice].bars.length) {
                                            if (pageIndex === 0 && index === 0) {
                                                return (<TimeSignature height={calculateHeightOfBar()} />)
                                            } else if (index % amountOfBarsPerRow === 0) {
                                                return (<BarNumber height={calculateHeightOfBar()} key={index} barNumber={indexToBeDisplayed} />)
                                            } else {
                                                return (<></>)
                                            }
                                        }
                                        return (<></>)
                                    }
                                    return <></>
                                })}
                            </Grid>

                            <Grid item xs={11}>
                                <Grid container>
                                    {voices[selectedVoice].bars.length === 0 ?
                                        <></>
                                        :
                                        <>
                                            {voices[selectedVoice].bars.slice(pageIndex * (rowsPerSheet * convertFromLengthOfBarToAmountOfBarsPerRow()), (pageIndex + 1) * rowsPerSheet * convertFromLengthOfBarToAmountOfBarsPerRow()).map((bar, i) => {
                                                return (
                                                    <>
                                                        <Grid item xs={lengthOfEachBar}  >
                                                            < BarContainer exportMode rowsPerSheet={convertFromLengthOfBarToAmountOfBarsPerRow()} height={calculateHeightOfBar()} voiceId={selectedVoice} barNumber={bar.barNumber as number} masterSheet={false} barLineAfter={isBarLineAfter(pageIndex, bar.barNumber as number)} barLineBefore={isBarLineBefore(i)} bar={bar} />
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
                <Grid container style={{ width: "90%", margin: "auto" }} justify="center" >
                    <Grid item xs={5} md={2} className={classes.box} style={{ padding: "8px", order: 1, marginRight: matches ? "0px" : "8px", marginBottom: matches ? "0px" : "12px" }}  >
                        {voices.length > 3 ?
                            (

                                <FormControl className={classes.formControl}>
                                    <Select value={dropDownMenuSelected} onChange={(e) => handleChange(e)} >
                                        {voices.map((voice, i) => {
                                            return <MenuItem onClick={() => history.replace("/song/" + id + "/export?voice=" + (i + 1))} key={i} value={i}>{voice.title}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            ) :
                            (
                                <Box style={{ padding: "8px" }}>
                                    {voices.map((voice, i) => {
                                        return <Button onClick={() => history.replace("/song/" + id + "/export?voice=" + (i + 1))} style={{ backgroundColor: selectedVoice === i ? colors.gray_200 : "white" }} className={classes.button} variant="outlined">{voice.title}</Button>

                                    })}
                                </Box>

                            )}
                    </Grid>
                    <Grid item xs={"auto"} md={1} style={{ order: 2 }}>

                    </Grid>
                    <Grid item xs={5} md={3} className={classes.slider} style={{ order: matches ? 3 : 3, marginRight: matches ? "0px" : "8px" }}>
                        <Typography variant="body1">{t("ExportView:barPerRow")}</Typography>
                        <Slider onChange={(event, value) => changeAmount(value)} defaultValue={4} step={null} marks={marks} min={1} max={6} valueLabelDisplay="auto" />
                    </Grid>
                    <Grid item xs={5} md={3} className={classes.slider} style={{ marginRight: matches ? "0px" : "0px", order: matches ? 4 : 4 }}>
                        <Typography variant="body1">{t("ExportView:rowsPerSheet")}</Typography>
                        <Slider onChange={(event, value) => changeRowsPerSheet(value)} defaultValue={4} step={1} marks min={1} max={5} valueLabelDisplay="auto" />
                    </Grid>
                    <Grid item xs={"auto"} md={1} style={{ order: 5 }}>

                    </Grid>
                    <Grid item xs={5} md={2} style={{ backgroundColor: "transparent", order: matches ? 5 : 2, marginBottom: matches ? "0px" : "12px" }} >
                        <Button className={classes.confirmOrCancelButtons} onClick={() => window.print()} style={{ backgroundColor: colors.teal_100 }}>{t("ExportView:createPDF")}</Button>
                        <Button className={classes.confirmOrCancelButtons} onClick={() => history.push("/song/" + id + "/")}> {t("ExportView:cancel")}</Button>
                    </Grid>
                </Grid>
            </BottomNavigation >


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
    box: {
        backgroundColor: "white",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",

    },
    formControl: {
        width: "90%",
        marginBottom: "8px",
    },
    button: {
        backgroundColor: colors.gray_100,
        marginRight: "4px",
        marginBottom: "4px",
        borderRadius: "4px",
        border: "1px solid #E0E0E0",
        height: "100%",
    },

    slider: {
        padding: "8px",
        backgroundColor: "white",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",

    },
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        height: "auto",
        paddingTop: "24px",
        paddingBottom: "24px",
        bottom: 0,
        borderTop: "1px solid " + colors.gray_300,
        backgroundColor: colors.gray_100,



    },
    confirmOrCancelButtons: {
        backgroundColor: " ",
        height: "100%",
        boxShadow: "3px 2px 4px rgba(66,66,66,0.06)",
        '@media (max-width: 960px)': {


        }

    },
})

export default ExportView;