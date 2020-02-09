import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField, EasyComponent } from '../../components';
import { UsuarioHelper } from '../../services';
export default class AuthenticationCriarConta extends EasyComponent {
    constructor(props){
        super(props, undefined, undefined, undefined, undefined, {flex: 1});
        this.state = {
            email: "",
            senha: "",
        }
    }
    disablePermissao = true;
    anonymousAllowed = true;
    registrar = () => {
        this.setCarregando(true);
        UsuarioHelper.registrarEmail(this.state.email, this.state.senha)
        .then(usuario=>{
            this.setCarregando(false);
            this.props.history.push("cadastrosobrevoce");
        })
        .catch(err=>{
            console.log(err);
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
    }
    change = ({target}) =>{
        this.setState({[target.name]: target.value});
    }
    renderWrite() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography align="center">Para começar, nos informe seu e-mail e uma senha:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="E-mail" variant="outlined"
                        inputMode="email"
                        className="DefaultPages_INPUTS"
                        value={this.state.email} name="email"
                    />
                    <MaskedTextField
                        onChange={this.change}
                        type="password"
                        label="Senha" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.senha} name="senha"
                    />
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.registrar}>
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
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
