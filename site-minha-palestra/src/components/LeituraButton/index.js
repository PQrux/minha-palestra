import React, { Component } from 'react';
import { EasyComponent } from '..';
import { Permissao } from "models-minha-palestra";
import { FormControlLabel, Switch } from '@material-ui/core';
export default class LeituraButton extends EasyComponent {
    constructor(props){
        super(props, new Permissao({grupo: "ADMINISTRADOR", permissao: "w"}));
    }
    carregarEntidade(){
        if(!(this.props.entidade instanceof EasyComponent)){
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
