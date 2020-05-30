import { FormControlLabel, Switch } from '@material-ui/core';
import { Permissao } from "models-minha-palestra";
import React from 'react';
import { EasyComponent } from '..';
export default class LeituraButton extends EasyComponent {
    constructor(props){
        super(props, new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}));
    }
    carregarEntidade(){
        if(!(this.props.entidade instanceof EasyComponent)||this.props.entidade.props.readOnly){
            this.setErro(".");
        }
        this.setCarregando(false);
    }
    renderError(){
        return (
            <div></div>
        )
    }
    renderLoading(){
        return (
            <div></div>
        )
    }
    renderDeny(){
        return (
            <div></div>
        )
    }
    trocar = () => {
        this.props.entidade.readOnly = !this.props.entidade.readOnly;
        this.props.entidade.setState({});
    }
    renderWrite() {
        return (
            <FormControlLabel
                control={
                    <Switch 
                        color="primary" 
                        checked={this.props.entidade.readOnly}
                        onChange={this.trocar}
                    />
                }
                disabled={this.props.disabled}
                label={this.props.entidade.readOnly ? "Visualização de Administrador" : "Visualização de Usuário"}
            />
        );
    }
}
