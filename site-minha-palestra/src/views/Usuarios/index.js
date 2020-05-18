import React from 'react';
import { List, ResponsiveDivider, SelectibleList, ResponsiveDividerBackButton } from '../../components';
import { Perfil } from '../../partialviews';
import { UsuarioHelper } from '../../services';
import { DataLocal } from '../../utils';
import { Box } from '@material-ui/core';

export default class PalestrasDisponiveis extends SelectibleList {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        UsuarioHelper.listarUsuarios(this.props.tipoFiltro, this.props.filtro).then(usuarios=>{
            this.usuarios = usuarios;
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}} noHistory={this.props.noHistory} changeToLeftRef={(ref)=>{this.setState({changeToLeft: ref})}}>
                <List
                    tituloLista="Usuários"
                    items={this.usuarios}
                    titulo={"nome"}
                    descriptors={[
                        {propriedade: "grupo", orderbyLabel: "Grupo"}, 
                        {label: "Descrição:", propriedade: "sobre", orderbyLabel: "Descrição"},
                        {label: "Registrado em:", propriedade: "dhCriacao", orderbyLabel: "Data de Registro", transform: DataLocal}
                    ]}
                    selected={this.state.selecionado}
                    onItemSelected={this.setSelecionado}
                    tituloLabel={"Nome do Usuário"}
                />
                <Box>
                    <ResponsiveDividerBackButton changeToLeft={this.state.changeToLeft}/>
                    <Perfil readOnly={this.props.readOnly} showNotFound entidade={this.state.selecionado} refreshParent={()=>{this.setState({})}}/>
                </Box>
            </ResponsiveDivider>
        );
    }
}
