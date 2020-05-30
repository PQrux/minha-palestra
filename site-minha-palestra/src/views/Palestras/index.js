import { Box, Chip } from '@material-ui/core';
import { Palestra } from "models-minha-palestra";
import React from 'react';
import { List, ResponsiveDivider, ResponsiveDividerBackButton, SelectibleList } from '../../components';
import { VisualizarPalestra } from '../../partialviews';
import { PalestrasHelper } from '../../services';
import { DataLocal } from "../../utils";
import "./styles.css";
export default class Palestras extends SelectibleList {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
        filtros: [],
        filtroSelecionado: 0,
    }
    carregarEntidade(){
        if(this.props.tipofiltro && this.props.filtro){
            this.state.filtros = [
                {orderby: this.props.tipofiltro, equalTo: this.props.filtro, post: this.props.post},
            ]
            this.setState({});
            this.listarPalestras();
        }
        else{
            this.state.filtros = [
                {orderby: "aprovada_finalizada", equalTo: "true_false", label: "Palestras Disponíveis"},
                {orderby: `participantes/${this.usuario.getUid()}/inscrito_compareceu`, equalTo: "true_false", label: "Palestras que estou inscrito", post: (palestras)=>{return palestras.filter(p=>(p.finalizada !== true))}},
                {orderby: `participantes/${this.usuario.getUid()}/compareceu`, equalTo: true, label: "Palestras que Participei"},
            ]
            if(this.usuario.grupo === "ADMINISTRADOR" || this.usuario.grupo === "PALESTRANTE"){
                this.state.filtros.push({orderby: "usuarioCriador", equalTo: this.usuario.path, label: "Palestras que Criei"});
                this.state.filtros.push({orderby: "palestrante", equalTo: this.usuario.path, label: "Palestras que Ministrei"});
            }
            if(this.usuario.grupo === "ADMINISTRADOR") this.state.filtros.push({orderby: "aprovada_finalizada", equalTo: "false_false", label: "Pendentes de Aprovação"})
            this.setState({});
            this.listarPalestras();
        }
    }
    listarPalestras = () =>{
        this.setCarregando(true);
        if(this.state.filtroSelecionado >= this.state.filtros.length){
            this.state.filtroSelecionado = 0;
        }
        const filtro = this.state.filtros[this.state.filtroSelecionado];
        PalestrasHelper.listarPalestras(filtro.orderby, filtro.equalTo).then(palestras=>{
            if(filtro.post) palestras = filtro.post(palestras);
            this.palestras = palestras;
            this.setCarregando(false);
            this.setState({});
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
    changeFiltro = (index) => {
        const filtro = this.state.filtros[index];
        if(filtro && index !== this.state.filtroSelecionado){
            this.state.filtroSelecionado = index;
            this.listarPalestras();
        }
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}} noHistory={this.props.noHistory} changeToRightRef={(c)=>{this.changeToRight = c; this.setState({})}} changeToLeftRef={(ref)=>{this.setState({changeToLeft: ref})}}>
                <Box>
                    {
                        this.state.filtros.length > 1 ? 
                        <Box className="Palestras_filters">
                            {this.state.filtros.map((filtro,i)=>(
                                <Chip 
                                    key={i} 
                                    color="primary" 
                                    onClick={()=>{this.changeFiltro(i)}} 
                                    variant={this.state.filtroSelecionado === i ? "default" : "outlined"} 
                                    label={filtro.label}
                                />
                            ))}
                        </Box> : undefined
                    }
                    <List
                        changeToRight={this.changeToRight}
                        mini
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
                        add={!this.props.readOnly && (this.usuario.grupo === "ADMINISTRADOR" || this.usuario.grupo === "PALESTRANTE") ? {label: "Criar Palestra", onClick: ()=>{this.setSelecionado(new Palestra())}} : undefined}
                    />
                </Box>
                <Box>
                    <ResponsiveDividerBackButton changeToLeft={this.state.changeToLeft}/>
                    <VisualizarPalestra refreshParent={this.refreshChild} showNotFound entidade={this.state.selecionado} readOnly={this.props.readOnly}/>
                </Box>
            </ResponsiveDivider>
        );
    }
}
