import React, { FC } from 'react';
import { makeStyles, Grid, Box, Typography } from '@material-ui/core';
import useLocalStorage from '@rehooks/local-storage';
import colors from '../../utils/colors';

export const SongViewMeasureComponent = () => {
  const measure = useLocalStorage('measure')[0];
  let measureNumerator = null;
  let measureDenominator: string | null = null;
  if (measure !== null) {
    measureNumerator = measure[0];
    measureDenominator = measure[1];
  }
  const style = useStyles();
  return (
    <Box className={style.MeasureContainer}>
      <Box><Typography className={style.MeasureNumerator}>{measureNumerator}</Typography></Box>
      <Box><Typography className={style.MeasureDenominator}>{measureDenominator}</Typography></Box>
    </Box>
  );
}

export const SongViewBarComponent = () => {
  const style = useStyles();
  return (
    <Box className={style.BarComponent}></Box>
  );
}

export type SongViewBarNumberProps = {
  barNumber: number
}
export const SongViewBarNumberComponent: FC<SongViewBarNumberProps> = ({ barNumber }) => {
  const style = useStyles();
  return (
    <Box className={style.BarNumberContainer}>
      <Typography variant="body1" className={style.BarNumberText}>{barNumber}</Typography>
    </Box>
  );
}
export default SongViewBarComponent;

const useStyles = makeStyles({
  MeasureContainer: {
    height: "200px",
    flexDirection: "column",
    display: "flex"
  },
  MeasureNumerator: {
    margin: "10px 10px 0 0",
    float: "right",
    fontWeight: "bold"
  },
  MeasureDenominator: {
    margin: "-5px 10px 0 0",
    float: "right",
    fontWeight: "bold"
  },
  BarComponent: {
    backgroundColor: "green",
    height: "200px",
    borderStyle: "double"
  },
  BarNumberContainer: {
    height: "200px"
  },
  BarNumberText: {
    margin: "10px 10px 0 0",
    float: "right",
    color: colors.gray_400
  }
})