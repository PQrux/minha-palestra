import { Box, FormControlLabel, MenuItem, Switch, TextField, Button } from '@material-ui/core';
import { Evento } from "models-minha-palestra";
import React from 'react';
import { EasyComponent, MaskedTextField, ResponsiveDividerBackButton, FloatingBox, DatePicker } from '../../components';
import { Permissoes } from "../../constants";
import { DialogHelper, EspacosHelper } from '../../services';
import { Arrayficar } from '../../utils';
import Galeria from '../Galeria';
import VisualizarLog from '../VisualizarLog';

export default class VisualizarEvento extends EasyComponent {
    constructor(props){
        super(props, Permissoes.evento);       
        this.state = {
            /**@type {Evento["prototype"]} */
            evento: {},
            loading: false,
            modificado: false,
        }
    }
    carregarEntidade(){
        let evento = new Evento();
        if(!evento.inicio || isNaN(evento.inicio.getTime())){
            evento.inicio = null;
        }
        if(!evento.termino || isNaN(evento.termino.getTime())){
            evento.termino = null;
        }
        this.setState({evento});
        this.setCarregando(false);
        /*
        if((this.props.entidade instanceof Evento)){
            this.setState({evento: this.props.entidade});
            this.setCarregando(false);
        }
        else{
            this.setNotFound(true);
        }
        */
    }
    change = ({target}) => {
        this.state.evento[target.name] = target.value;
        this.setState({modificado: true});
    }
    changeDate = (prop,value) =>{
        this.state.evento[prop] = value;
        this.setState({});
    }
    salvar = () =>{
        this.setState({loading: true});
        EspacosHelper.salvar(this.state.evento).then((evento)=>{
            if(this.props.refreshParent) this.props.refreshParent(evento);
            this.setState({evento, modificado: false, loading: false});
        })
        .catch(err=>{
            DialogHelper.showError(err);
            this.setState({loading: false});
        })
    }
    renderWrite() {
        return (
        <Box className="DefaultPages_INSIDER">
            <Box className="DefaultPages_ROOT">
                <TextField
                    label="Nome do Evento"
                    variant="outlined"
                    fullWidth
                    name="nome"
                    value={this.state.evento.nome}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <TextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={this.state.evento.descricao}
                    name="descricao"
                    disabled={this.state.loading}
                    onChange={this.change}
                />
                <MaskedTextField
                    mask="000"
                    label="Limite de inscrições"
                    variant="outlined"
                    fullWidth
                    name="limiteInscricoes"
                    value={this.state.evento.limiteInscricoes}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <DatePicker 
                    inputVariant="outlined" 
                    label="Data de Início" 
                    fullWidth 
                    tipo="datetime"
                    name="inicio"
                    value={this.state.evento.inicio}
                    onChange={(v)=>{this.changeDate("inicio", v)}}
                    disabled={this.state.loading}
                />
                <VisualizarLog log={this.state.evento.ultimoLog} width="100%"/>
                <FloatingBox>
                    <ResponsiveDividerBackButton changeToLeft={this.props.changeToLeft}/>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={this.salvar}
                        disabled={this.state.loading||!this.state.modificado}
                        style={{marginLeft: 10, display: this.state.modificado ? "block" : "none"}}
                    >
                        Salvar
                    </Button>
                </FloatingBox>
            </Box>
        </Box>
        );
    }
}