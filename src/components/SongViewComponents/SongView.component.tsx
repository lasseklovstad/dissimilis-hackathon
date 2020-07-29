import React, { FC, useContext } from 'react';
import { makeStyles, Box, Typography } from '@material-ui/core';
import colors from '../../utils/colors';
import { SongContext } from '../../views/SongView/SongContextProvider.component';


export type TimeSignatureProps = {
  height?: number,
}
export const TimeSignature: FC<TimeSignatureProps> = (props) => {
  const { song } = useContext(SongContext);
  const timeSignatureString = song.timeSignature;
  const timeSignatureNumerator = timeSignatureString.split("/")[0];
  const timeSignatureDenominator = timeSignatureString.split("/")[1];

  const style = useStyles();
  return (
    <Box className={style.TimeSignatureContainer} style={{ height: !props.height ? "240px" : (props.height + 80) + "px" }}>
      <Box><Typography className={style.TimeSignatureNumerator}>{timeSignatureNumerator}</Typography></Box>
      <Box><Typography className={style.TimeSignatureDenominator}>{timeSignatureDenominator}</Typography></Box>
    </Box>
  );
}

export const Bar: FC<TimeSignatureProps> = (props) => {
  const style = useStyles();
  return (
    <Box className={style.BarComponent} style={{ height: !props.height ? "160px" : (props.height + 80) + "px" }}></Box>
  );
}

export type SongViewBarNumberProps = {
  barNumber: number,
  height?: number,
}
export const BarNumber: FC<SongViewBarNumberProps> = (props) => {
  const style = useStyles();
  return (
    <Box className={style.BarNumberContainer} style={{ height: !props.height ? "160px" : (props.height + 80) + "px" }}>
      <Typography variant="body1" className={style.BarNumberText}>{props.barNumber}</Typography>
    </Box>
  );
}
export default BarNumber;

const useStyles = makeStyles({
  TimeSignatureContainer: {
    flexDirection: "column",
    display: "flex"
  },
  TimeSignatureNumerator: {
    margin: "36px 10px 0 0",
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
    borderStyle: "double"
  },
  BarNumberContainer: {
    height: "200px"
  },
  BarNumberText: {
    margin: "40px 10px 0 0",
    float: "right",
    color: colors.gray_400
  }
})