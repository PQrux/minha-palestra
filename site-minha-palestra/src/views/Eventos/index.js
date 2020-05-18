import React from 'react';
import { List, ResponsiveDivider, SelectibleList, ResponsiveDividerBackButton } from '../../components';
import { VisualizarEvento } from '../../partialviews';
import { EventosHelper } from '../../services';
import { Evento } from "models-minha-palestra";
import { DataLocal } from "../../utils";
import { Box } from '@material-ui/core';
export default class Eventos extends SelectibleList {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        EventosHelper.listar("termino", new Date().getTime(), "startAt").then(eventos=>{
            this.eventos = eventos;
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    refreshChild = (evento) => {
        if(!this.eventos.find(eventoss=>eventoss.path === evento.path)){
            this.eventos.push(evento);
        }
        this.setState({});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}} noHistory={this.props.noHistory} changeToLeftRef={(ref)=>{this.setState({changeToLeft: ref})}}>
                <List
                    mini
                    tituloLista="Eventos"
                    items={this.eventos}
                    titulo={"nome"}
                    descriptors={[
                        {propriedade: "descricao", orderbyLabel: "Descrição"},
                        {propriedade: "inicio", orderbyLabel: "Início", label: "Início:", transform: DataLocal}, 
                        {label: "Encerramento:", propriedade: "termino", orderbyLabel: "Encerramento", transform: DataLocal},
                    ]}
                    selected={this.state.selecionado}
                    onItemSelected={this.setSelecionado}
                    tituloLabel={"Nome"}
                    add={this.usuario.grupo === "ADMINISTRADOR" && !this.props.readOnly ? {label: "Adicionar Evento", onClick: ()=>{this.setSelecionado(new Evento())}} : undefined}
                />
                <Box>
                    <ResponsiveDividerBackButton changeToLeft={this.state.changeToLeft}/>
                    <VisualizarEvento readOnly={this.props.readOnly} refreshParent={this.refreshChild} showNotFound entidade={this.state.selecionado}/>
                </Box>
            </ResponsiveDivider>
        );
    }
}
