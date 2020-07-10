import React, { FC } from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
import useLocalStorage from '@rehooks/local-storage';
import colors from '../../utils/colors';

export const TimeSignature = () => {
  const timeSignature = useLocalStorage('timeSignature')[0];
  let timeSignatureNumerator: string | null = null;
  let timeSignatureDenominator: string | null = null;
  if (timeSignature !== null) {
    timeSignatureNumerator = timeSignature[0];
    timeSignatureDenominator = timeSignature[1];
  }
  const style = useStyles();
  return (
    <Box className={style.TimeSignatureContainer}>
      <Box><Typography className={style.TimeSignatureNumerator}>{timeSignatureNumerator}</Typography></Box>
      <Box><Typography className={style.TimeSignatureDenominator}>{timeSignatureDenominator}</Typography></Box>
    </Box>
  );
}

export const Bar = () => {
  const style = useStyles();
  return (
    <Box className={style.BarComponent}></Box>
  );
}

export type SongViewBarNumberProps = {
  barNumber: number
}
export const BarNumber: FC<SongViewBarNumberProps> = ({ barNumber }) => {
  const style = useStyles();
  return (
    <Box className={style.BarNumberContainer}>
      <Typography variant="body1" className={style.BarNumberText}>{barNumber}</Typography>
    </Box>
  );
}
export default BarNumber;

const useStyles = makeStyles({
  TimeSignatureContainer: {
    height: "200px",
    flexDirection: "column",
    display: "flex"
  },
  TimeSignatureNumerator: {
    margin: "10px 10px 0 0",
    float: "right",
    fontWeight: "bold"
  },
  TimeSignatureDenominator: {
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