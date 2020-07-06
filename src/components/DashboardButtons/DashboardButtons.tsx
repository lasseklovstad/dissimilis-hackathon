import React,  { FunctionComponent } from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { Box, Card, CardActionArea, Icon } from '@material-ui/core';
import { colors } from '../../utils/colors';
import butterflyBlue from '../../assets/images/butterflyBlue.svg'
import { useTranslation } from "react-i18next";

export type ButtonProps = {
  text: string,
  link: string,
  func? : Function,
  color? : string,
};

export const DashboardButtonWithAddIcon: FunctionComponent<ButtonProps> = (props) => {
  const styles = useStyles();
  return (
      <Card className={styles.button}>
        <CardActionArea onClick={() => props.func && props.func()} >
          <Box className={styles.container} >
            <Box py={2} pl={2}><AddIcon /></Box>
            <Box py={2} pl={1} pr={2}><Typography>{props.text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
  );
}

export const DashboardButton: FunctionComponent<ButtonProps> = (props) => {
  const styles = useStyles();
  return (
      <Card className={styles.button}>
        <CardActionArea to={props.link} component={Link}>
          <Box className={styles.container} style={{backgroundColor: props.color}}>
            <Box p={2}><Typography>{props.text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
  );
}

export const DashboardLibraryButton: FunctionComponent<ButtonProps> = ({text, link}) => {
  const styles = useStyles();
  return (
    <Box>
      <Card className={styles.button__green}>
        <CardActionArea to={link} component={Link}>
          <Box className={styles.container}>
            <Box p={2}><Typography>{text}</Typography></Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export const DashboardTopBarIcon = () => {
  const styles = useStyles();
  const {t, i18n} = useTranslation();
  const altProp = t("DashboardView:altButteflyButtonProp");
  return (
    <Box className={styles.butterflyButton__Container}>
      <Card className={styles.butterflyButton__Card}>
        <CardActionArea className={styles.butterflyButton__Card__Icon} to="/dashboard" component={Link}>
          <Icon>
            <img src={butterflyBlue} alt={altProp} />
          </Icon>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export default DashboardButton;

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  button: {
    backgroundColor: colors.white,
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  button__green: {
    backgroundColor: colors.teal_100,
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  butterflyButton__Container: {
    maxHeight: '48px',
    maxWidth: '48px',
    backgroundColor: colors.white,
  },
  butterflyButton__Card: {
    boxShadow: "2px 0px 3px rgba(66, 66, 66, 0.05)"
  },
  butterflyButton__Card__Icon: {
    padding: "9px",
    borderRadius: "1px",
  }
});
