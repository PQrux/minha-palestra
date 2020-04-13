import React from 'react';
import { EasyComponent, List, ResponsiveDivider } from '../../components';
import { Perfil } from '../../partialviews';
import { UsuarioHelper } from '../../services';
import { DataLocal } from '../../utils';

export default class PalestrasDisponiveis extends EasyComponent {
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
    changeItem=(item)=>{
        this.setState({selecionado: item});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}}>
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
                    onItemSelected={this.changeItem}
                    tituloLabel={"Nome do Usuário"}
                />
                <Perfil showNotFound entidade={this.state.selecionado} refreshParent={()=>{this.setState({})}}/>
            </ResponsiveDivider>
        );
    }
}
