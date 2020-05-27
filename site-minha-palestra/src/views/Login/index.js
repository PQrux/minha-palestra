import React, { Component } from 'react';
import { Box, Fab } from "@material-ui/core";
import { KeyboardArrowDown } from "@material-ui/icons";
import "./styles.css";
import palestra from "../../assets/images/palestra_img.jpg";
import { Authentication } from "../../routes";
import $ from "jquery";
export default class Login extends Component {
  descer = () =>{
    let target = $('html,body'); 
    target.animate({scrollTop: $("#scrollTarget").offset().top}, 1000);
  }
  render() {
    return (
        <Box className="Login_container">
          <Box display="flex" flex="3" id="scrollTarget">
            <Authentication history={this.props.history}/>
          </Box>
          <Box 
            style={{backgroundImage: `url(${palestra})`}} display="flex"
            bgcolor="black" flex="7" className="Login_bg_image"
          >
            <Box className="Login_text_container">
              <Box className="Login_titles">
                <h1 className="whiteText Login_text_bigText_h1">Descubra um novo mundo</h1>
                <h2 className="whiteText Login_text_bigText_h2">Repleto de conhecimento</h2>
                <p className="whiteText">
                  Com o Minha Palestra, você pode participar de diversas palestras e ainda receber certificados por isso!
                </p>
              </Box>
              <Fab variant="extended" color="primary" onClick={this.descer} className="Login_down_button">
                <KeyboardArrowDown className="whiteText"/>
                <span className="whiteText">Conectar-se</span>
              </Fab>
              <p className="whiteText centerText">Minha Palestra v0.9 - {new Date().getFullYear()}</p>
            </Box>
          </Box>
        </Box>
    );
  }
}
