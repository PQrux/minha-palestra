import React, { Component } from 'react';
import { Box, Button, Link } from "@material-ui/core";
import logo from "../../assets/images/logo.png";
import { MaskedTextField } from "../../components";
import "./styles.css";

export default class AuthenticationLogin extends Component {
    state = {
        email: "",
        senha: "",
    }
    mudar = () =>{
        this.setState({email: "loaaa"});
    }
    change = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }
    render() {
        return (
            <Box className="AuthenticationLogin_ROOT">
                <img src={logo} style={styles.img} alt="logo"></img>
                <MaskedTextField
                    onChange={this.change}
                    label="E-mail" variant="outlined"
                    className="AuthenticationLogin_INPUTS"
                    value={this.state.email} name="email"
                />
                <MaskedTextField
                    onChange={this.change}
                    label="Senha" variant="outlined"
                    className="AuthenticationLogin_INPUTS"
                    value={this.state.senha} name="senha"
                />
                <Link>
                    Esqueci minha senha
                </Link>
                <Button className="AuthenticationLogin_BUTTON" color="primary" variant="outlined">
                    ENTRAR
                </Button>
                <Button className="AuthenticationLogin_BUTTON" color="secondary" variant="outlined">
                    CRIAR UMA CONTA
                </Button>
            </Box>
        );
    }
}
const styles = {
    img: {
      height: "150px",
      maxWidth: "90vw",
      marginBottom: "20px",
    }
}