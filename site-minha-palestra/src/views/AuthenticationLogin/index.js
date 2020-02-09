import React from 'react';
import { Box, Button, Link } from "@material-ui/core";
import logo from "../../assets/images/logo.png";
import { MaskedTextField, EasyComponent } from "../../components";
import { UsuarioHelper } from '../../services';
import DeterminarTelaCadastroUsuario from '../../utils/DeterminarTelaUsuario';

export default class AuthenticationLogin extends EasyComponent {
    constructor(props){
        super(props, undefined, undefined, undefined, undefined, {flex: 1});
        this.state = {
            email: "",
            senha: "",
        }
    }
    disablePermissao = true;
    anonymousAllowed = true;
    change = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }
    goToCriarConta = () =>{
        this.props.history.push("criarconta");
    }
    submit = () => {
        const { email, senha } = this.state;
        this.setCarregando(true);
        UsuarioHelper.loginEmail(email, senha)
        .then(usuario=>{
            let tc = DeterminarTelaCadastroUsuario(usuario);
            if(tc) this.props.history.push(tc);
        })
        .catch(err=>{
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
    }
    goToEsqueci = () =>{
        this.props.history.push("esqueciminhasenha");
    }
    renderWrite() {
        return (
            <Box className="DefaultPages_ROOT">
                <img src={logo} style={styles.img} alt="logo"></img>
                <MaskedTextField
                    onChange={this.change}
                    label="E-mail" variant="outlined"
                    inputMode="email"
                    className="DefaultPages_INPUTS"
                    value={this.state.email} name="email"
                />
                <MaskedTextField
                    onChange={this.change}
                    label="Senha" variant="outlined"
                    type="password"
                    className="DefaultPages_INPUTS"
                    value={this.state.senha} name="senha"
                />
                <Link onClick={this.goToEsqueci}>
                    Esqueci minha senha
                </Link>
                <Button className="DefaultPages_BUTTON" color="primary" variant="outlined" onClick={this.submit}>
                    ENTRAR
                </Button>
                <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.goToCriarConta}>
                    CRIAR UMA CONTA
                </Button>
            </Box>
        );
    }
    resetError = () => {
        this.setErro(undefined);
    }
    renderError(){
        return (
            <Box className="DefaultPages_ROOT">
                {super.renderError()}
                <Button onClick={this.resetError} color="primary" variant="outlined">
                    Tentar Novamente
                </Button>
            </Box>
        )
    }
}
const styles = {
    img: {
      height: "150px",
      maxWidth: "90vw",
      marginBottom: "20px",
    }
}