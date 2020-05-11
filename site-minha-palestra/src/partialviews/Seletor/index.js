import React, { Component } from 'react';
import { EasyComponent } from '../../components';
import { Permissao } from "models-minha-palestra";
import "./styles.css";
import { Permissoes } from '../../constants';
import { UsuarioHelper, EventosHelper, EspacosHelper, DialogHelper } from '../../services';
import Perfil from '../Perfil';
import VisualizarEvento from '../VisualizarEvento';
import VisualizarEspaco from '../VisualizarEspaco';
import { Box, Button, Typography } from '@material-ui/core';
import { Usuarios, Eventos, EspacosDeApresentacao } from '../../views';

export default class Seletor extends EasyComponent {
    constructor(props){
        super(props, new Permissao({}));
        switch(this.props.tipo){
            case "usuario":this.permissor = Permissoes.selecionar_palestrante;break;
            case "evento":this.permissor = Permissoes.selecionar_evento;break;
            case "espaco":this.permissor = Permissoes.selecionar_espaco;break;
        }
        this.state = {
            selecionado: null,
        }
    }
    carregarEntidade(){
        if(!this.props.entidade){
            this.setState({selecionado: null});
            this.setCarregando(false);
        }
        else if(this.props.entidade !== this.state.selecionado){
            this.setCarregando(true);
            let proms;
            switch(this.props.tipo){
                case "usuario":
                    proms = UsuarioHelper.buscar(this.props.entidade);
                break;
                case "evento":
                    proms = EventosHelper.buscar(this.props.entidade);
                break;
                case "espaco":
                    proms = EspacosHelper.buscar(this.props.entidade);
                break;
                default:
                    throw "Erro! Tipo inválido.";
                break;
            }
            proms.then((obj)=>{
                this.setState({selecionado: obj});
                this.setCarregando(false);
            })
            .catch(err=>{
                DialogHelper.showError(err);
                this.setState({selecionado: null});
                this.setCarregando(false);
            })
        }
        else{
            this.setCarregando(false);
        }
    }
    selecionarRender() {
        switch(this.props.tipo){
            case "usuario":return (<Perfil minimal readOnly entidade={this.state.selecionado}/>);break;
            case "evento":return (<VisualizarEvento minimal readOnly entidade={this.state.selecionado}/>);break;
            case "espaco":return (<VisualizarEspaco minimal readOnly entidade={this.state.selecionado}/>);break;
            default: throw "Erro! Tipo inválido.";break;
        }
    }
    selecionar = () => {
        let selecionado, selector;
        const selecionar=(selecao)=>{
            selecionado = selecao;
        }
        switch(this.props.tipo){
            case "usuario":selector = (<Usuarios noHistory readOnly onSelecionado={selecionar}/>);break;
            case "evento":selector = (<Eventos noHistory readOnly onSelecionado={selecionar}/>);break;
            case "espaco":selector = (<EspacosDeApresentacao noHistory readOnly onSelecionado={selecionar}/>);break;
            default: throw "Erro! Tipo inválido.";break;
        }
        DialogHelper.showDialog(null, selector, 
            <Box display="flex">
                <Button color="secondary" variant="outlined" onClick={DialogHelper.closeDialog}>
                    CANCELAR
                </Button>
                <Button 
                    style={{marginLeft: 10}}
                    color="primary" 
                    variant="contained" 
                    onClick={()=>{
                        DialogHelper.closeDialog();
                        if(selecionado){
                            this.setState({selecionado});
                            if(this.props.onSelecionado) this.props.onSelecionado(selecionado);
                        }
                    }}
                >
                    OK
                </Button>
            </Box>
        )
    }
    renderWrite(){
        return (
            <Box className="seletor_root" {...this.props.BoxProps||{}}>
                <Box>
                    <Typography variant="h6">
                        {this.props.tipo === "usuario" ? "Palestrante" : this.props.tipo === "evento" ? "Evento" : "Local"}
                    </Typography>
                    <Box className="seletor_root" width="100%" bgcolor="#EEE">
                        {this.state.selecionado ? this.selecionarRender() : <Typography>Nenhum item selecionado.</Typography>}
                    </Box>
                    <Button style={{alignSelf: "center", marginTop: 10}} color="primary" variant="contained" onClick={this.selecionar}>
                        SELECIONAR
                    </Button>
                </Box>
            </Box>
        )
    }
    renderRead(){
        return (
            <Box className="seletor_root" {...this.props.BoxProps||{}}>
                <Box>
                    <Typography variant="h6">
                        {this.props.tipo === "usuario" ? "Palestrante" : this.props.tipo === "evento" ? "Evento" : "Local"}
                    </Typography>
                    <Box className="seletor_root" width="100%" bgcolor="#EEE">
                        {this.selecionarRender()}
                    </Box>
                </Box>
            </Box>
        )
    }
}
