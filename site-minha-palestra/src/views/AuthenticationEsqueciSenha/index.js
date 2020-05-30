import React from 'react';
import { Box, Button, Typography } from "@material-ui/core";
import { MaskedTextField, EasyComponent } from "../../components";
import { UsuarioHelper } from '../../services';

export default class AuthenticationEsqueciSenha extends EasyComponent {
    constructor(props){
        super(props, undefined, undefined, undefined, undefined, {flex: 1});
        this.state = {
            email: "",
            feito: false,
        }
    }
    disablePermissao = true;
    anonymousAllowed = true;
    change = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }
    submit = () => {
        const { email } = this.state;
        this.setCarregando(true);
        UsuarioHelper.enviarEmailDeRecuperacaoDeSenha(email)
        .then(()=>{
            this.setCarregando(false);
            this.setState({feito: true});
        })
        .catch(err=>{
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
    }
    renderWrite() {
        if(this.state.feito)
        return (
            <Box className="DefaultPages_ROOT">
                <Typography align="center">
                    Um e-mail de recuperação foi enviado para a sua caixa de entrada, por favor, atualize sua senha e tente conectar-se novamente.
                </Typography>
                <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.props.history.goBack}>
                    VOLTAR
                </Button>
            </Box>
        )
        else
        return (
            <form className="DefaultPages_ROOT" onSubmit={this.submit}>
                <Typography align="center">
                    Esqueceu sua senha? Não se preocupe, vamos recuperá-la agora para você.
                </Typography>
                <Typography align="center">
                    Basta que informe o seu endereço de e-mail abaixo e lhe enviaremos um e-mail de recuperação de senha.
                </Typography>
                <MaskedTextField
                    onChange={this.change}
                    label="E-mail" variant="outlined"
                    inputMode="email"
                    className="DefaultPages_INPUTS"
                    value={this.state.email} name="email"
                />
                <Button className="DefaultPages_BUTTON" color="primary" variant="outlined" type="submit">
                    ENVIAR
                </Button>
                <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.props.history.goBack}>
                    VOLTAR
                </Button>
            </form>
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