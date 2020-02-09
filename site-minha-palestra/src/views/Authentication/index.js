import React from "react";
import { EasyComponent } from '../../components';
import { UsuarioHelper } from '../../services';
import { Usuario } from "models-minha-palestra";
import { Button, Box } from '@material-ui/core';

export default class Authentication extends EasyComponent {
    constructor(props){
        super(props, undefined, undefined, undefined, undefined, {flex: 1});
        this.state = {
            /**@type {Usuario["prototype"]} */
            usuario: {},
        }
    }
    disablePermissao = true;
    anonymousAllowed = true;
    nextPage = "";
    submit = () => {
        this.setCarregando(true);
        UsuarioHelper.atualizarUsuario(this.usuario).then(usuario=>{
            this.setState({usuario: usuario});
            this.setCarregando(false);
            this.props.history.push(this.nextPage);
        })
        .catch(err=>{
            this.setCarregando(false);
            this.setErro(err.descricao);
        })
    }
    change = ({target}) =>{
        this.usuario[target.name] = target.value;
        this.setState({});
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
    carregarEntidade(){
        this.setCarregando(false);
        if((this.usuario instanceof Usuario)){
            this.state.usuario = this.usuario;
            this.setCarregando(false);
        }
        else{
            this.props.history.push("");
        }
    }
}
