import React, { Component } from 'react';
import { Box, CircularProgress } from "@material-ui/core";
import logo from "../../assets/images/logo.png";
export default class Splash extends Component {
  render() {
    return (
      <Box height="100vh" display="flex" bgcolor="white" flexDirection="column" justifyContent="center" alignItems="center"> 
        <img src={logo} style={styles.img} alt="logo"></img>
        <CircularProgress />
      </Box>
    );
  }
}
const styles = {
    img: {
      height: "50%",
      maxWidth: "90vw",
      marginBottom: "20px",
    }
}