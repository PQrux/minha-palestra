import React from 'react';
import { List, ResponsiveDivider, SelectibleList } from '../../components';
import { VisualizarPalestra } from '../../partialviews';
import { PalestrasHelper } from '../../services';
import { Palestra } from "models-minha-palestra";
import { DataLocal } from "../../utils";
export default class Palestras extends SelectibleList {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        PalestrasHelper.listarPalestrasDisponiveis().then(palestras=>{
            this.palestras = palestras;
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    refreshChild = (palestra) => {
        if(!this.palestras.find(palestrass=>palestrass.path === palestra.path)){
            this.palestras.push(palestra);
        }
        this.setState({});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}}>
                <List
                    tituloLista="Palestras"
                    items={this.palestras}
                    titulo={"nome"}
                    descriptors={[
                        {propriedade: "dhApresentacao", orderbyLabel: "Data de Apresentação", label: "Apresentação em:", transform: DataLocal},
                        {propriedade: "descricao", orderbyLabel: "Descrição"},
                    ]}
                    selected={this.state.selecionado}
                    onItemSelected={this.setSelecionado}
                    tituloLabel={"Nome"}
                    add={this.usuario.grupo === "ADMINISTRADOR" || this.usuario.grupo === "PALESTRANTE" ? {label: "Criar Palestra", onClick: ()=>{this.setSelecionado(new Palestra())}} : undefined}
                />
                <VisualizarPalestra refreshParent={this.refreshChild} showNotFound entidade={this.state.selecionado}/>
            </ResponsiveDivider>
        );
    }
}
