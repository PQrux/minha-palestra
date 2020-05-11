import React from 'react';
import { List, ResponsiveDivider, SelectibleList } from '../../components';
import { Perfil } from '../../partialviews';
import { UsuarioHelper } from '../../services';
import { DataLocal } from '../../utils';

export default class PalestrasDisponiveis extends SelectibleList {
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
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}} noHistory={this.props.noHistory}>
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
                <Perfil readOnly={this.props.readOnly} showNotFound entidade={this.state.selecionado} refreshParent={()=>{this.setState({})}}/>
            </ResponsiveDivider>
        );
    }
}
