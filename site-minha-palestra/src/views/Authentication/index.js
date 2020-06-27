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
    /**@type {Object<string, {type: "string"|"number"|"Date", max: any, min: any, aviso: string}>} */
    checkInfo = {};
    submit = () => {
        for(let i in this.checkInfo){
            let check = this.checkInfo[i];
            let prop = this.usuario[i];
            if(prop == null){
                this.setErro(check.aviso);
                return false;
            }
            if(check.type === "number"){
                if(typeof prop !== "number"||
                (check.min && check.min > prop)||
                (check.max && check.max < prop)){
                    this.setErro(check.aviso);
                    return false;
                }
            }
            else if(check.type === "string"){
                if(typeof prop !== "string"||
                (check.min && check.min > prop.length)||
                (check.max && check.max < prop.length)){
                    this.setErro(check.aviso);
                    return false;
                }
            }
            else if(check.type === "Date"){
                if(typeof prop.getTime !== "function"|| !prop.getTime() ||
                (check.min && check.min > prop)||
                (check.max && check.max < prop)){
                    this.setErro(check.aviso);
                    return false;
                }
            }
        }
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
        return false;
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
