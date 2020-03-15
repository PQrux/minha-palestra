import React, { Component } from 'react';
import { ResponsiveDivider, List, EasyComponent } from '../../components';
import { Button, Box } from '@material-ui/core';
import { Perfil } from '../../partialviews';
import { UsuarioHelper } from '../../services';

export default class Usuarios extends EasyComponent {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        UsuarioHelper.listarUsuarios().then(usuarios=>{
            this.usuarios = usuarios;
            this.setState({selecionado: usuarios[0]});
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    changeItem=(item)=>{
        this.setState({selecionado: item});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}}>
                <List
                    items={this.usuarios}
                    titulo={"nome"}
                    descriptors={[{label: "Descrição:", propriedade: "sobre"}]}
                    selected={this.state.selecionado}
                    onItemSelected={this.changeItem}
                />
                <Box style={{overflowY: "auto", height: "100%"}}>
                    <Perfil showNotFound entidade={this.state.selecionado}/>
                </Box>
            </ResponsiveDivider>
        );
    }
}
