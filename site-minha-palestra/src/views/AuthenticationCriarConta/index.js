import React from 'react';
import { Box, Button, Typography, Link } from '@material-ui/core';
import { MaskedTextField, EasyComponent } from '../../components';
import { UsuarioHelper, DialogHelper } from '../../services';
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
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
        return false;
    }
    change = ({target}) =>{
        this.setState({[target.name]: target.value});
    }
    politica = () => {
        DialogHelper.showDialog("Política de Privacidade", <Typography align="justify" style={{whiteSpace:"pre-line"}}>{window.strings.politica_de_privacidade}</Typography>, DialogHelper.okButton);
    }
    renderWrite() {
        return (
                <form className="DefaultPages_ROOT" onSubmit={e => {e.preventDefault();this.registrar();}}>
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
                    <Typography variant="caption">Clicando em PROSSEGUIR você concorda com os termos da <Link onClick={this.politica}>POLÍTICA DE PRIVACIDADE.</Link></Typography>
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" type="submit">
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
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