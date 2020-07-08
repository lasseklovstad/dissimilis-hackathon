import React from 'react';
import { makeStyles, Grid, Box } from '@material-ui/core';

export const SongViewMeasureComponent = () => {

  return (
    <Box style={{ backgroundColor: "blue", height: "200px", borderStyle: "double" }}>
    </Box>
  );
}

export const SongViewBarComponent = () => {

  return (
    <Box style={{ backgroundColor: "green", height: "200px", borderStyle: "double" }}></Box>
  );
}

export const SongViewBarNumberComponent = () => {

  return (
    <Box style={{ backgroundColor: "red", height: "200px", borderStyle: "double" }}>
    </Box>
  );
}

export default SongViewBarComponent;









const useStyles = makeStyles((theme) => ({


}));