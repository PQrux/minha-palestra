import React from 'react';
import { EasyComponent, List, ResponsiveDivider } from '../../components';
import { VisualizarEvento } from '../../partialviews';
import { EventosHelper } from '../../services';
import { Evento } from "models-minha-palestra";
import { DataLocal } from "../../utils";
export default class Eventos extends EasyComponent {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        EventosHelper.listar().then(eventos=>{
            this.eventos = eventos;
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    changeItem=(item)=>{
        this.setState({selecionado: item});
    }
    refreshChild = (evento) => {
        if(!this.eventos.find(eventoss=>eventoss.path === evento.path)){
            this.eventos.push(evento);
        }
        this.setState({});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}}>
                <List
                    tituloLista="Eventos"
                    items={this.eventos}
                    titulo={"nome"}
                    descriptors={[
                        {propriedade: "descricao", orderbyLabel: "Descrição"},
                        {propriedade: "inicio", orderbyLabel: "Início", label: "Início:", transform: DataLocal}, 
                        {label: "Encerramento:", propriedade: "termino", orderbyLabel: "Encerramento", transform: DataLocal},
                    ]}
                    selected={this.state.selecionado}
                    onItemSelected={this.changeItem}
                    tituloLabel={"Nome"}
                    add={this.usuario.grupo === "ADMINISTRADOR" ? {label: "Adicionar Evento", onClick: ()=>{this.changeItem(new Evento())}} : undefined}
                />
                <VisualizarEvento refreshParent={this.refreshChild} showNotFound entidade={this.state.selecionado}/>
            </ResponsiveDivider>
        );
    }
}