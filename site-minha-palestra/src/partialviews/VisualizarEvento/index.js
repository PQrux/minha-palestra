import { Box, Button, Typography } from '@material-ui/core';
import { Evento } from "models-minha-palestra";
import React from 'react';
import { DatePicker, EasyComponent, FloatingBox, MaskedTextField, ResponsiveDividerBackButton, LeituraButton } from '../../components';
import { Permissoes } from "../../constants";
import { DialogHelper, EventosHelper } from '../../services';
import { DataLocal } from '../../utils';
import VisualizarLog from '../VisualizarLog';
import Seletor from '../Seletor';
import { Palestras } from '../../views';
import "./styles.css";

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
        if((this.props.entidade instanceof Evento)){
            if(!this.props.entidade.inicio || isNaN(this.props.entidade.inicio.getTime())){
                this.props.entidade.inicio = null;
            }
            if(!this.props.entidade.termino || isNaN(this.props.entidade.termino.getTime())){
                this.props.entidade.termino = null;
            }
            this.setState({evento: this.props.entidade, modificado: false});
            this.setNotFound(false);
            this.setCarregando(false);
        }
        else{
            this.setNotFound(true);
        }
    }
    change = ({target}) => {
        this.state.evento[target.name] = target.value;
        this.setState({modificado: true});
    }
    changeDate = (prop,value) =>{
        this.state.evento[prop] = value;
        this.setState({modificado: true});
    }
    salvar = () =>{
        this.setState({loading: true});
        EventosHelper.salvar(this.state.evento).then((evento)=>{
            if(this.props.refreshParent) this.props.refreshParent(evento);
            this.setState({evento, modificado: false, loading: false});
        })
        .catch(err=>{
            DialogHelper.showError(err);
            this.setState({loading: false});
        })
    }
    renderMinimal(){
        return (
            <Box>
                <Typography style={{textTransform: "uppercase"}}>
                    {this.state.evento.nome}
                </Typography>
                <Typography>
                    {this.state.evento.descricao}
                </Typography>
            </Box>
        )
    }
    renderRead(){
        if(this.props.minimal)
        return (this.renderMinimal())
        return (
            <Box className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT evento_root">
                    <Typography align="center" variant="h3">
                        {this.state.evento.nome}
                    </Typography>
                    <Typography>
                        {this.state.evento.descricao}
                    </Typography>
                    <Typography align="center">
                        Disponível em: {DataLocal(this.state.evento.inicio)} até {DataLocal(this.state.evento.termino)}
                    </Typography>
                    { this.state.evento.limiteInscricoes ? 
                        <Typography>
                           Você poderá se inscrever em {this.state.evento.limiteInscricoes} palestras deste evento.
                        </Typography> : undefined
                    }
                    <LeituraButton entidade={this}/>
                    <Box className="default_border" width="100%">
                        <Palestras 
                            noHistory
                            tipofiltro="evento"
                            filtro={this.state.evento.path}
                            post={(lista)=>lista.filter(i=>i.finalizada === false)}
                            entidade={this.state.evento.path}
                            readOnly
                        />
                    </Box>
                </Box>
            </Box>
        )
    }
    renderWrite() {
        return (
        <Box className="DefaultPages_INSIDER">
            <Box className="DefaultPages_ROOT">
                <MaskedTextField
                    label="Nome do Evento"
                    variant="outlined"
                    fullWidth
                    name="nome"
                    value={this.state.evento.nome}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={this.state.evento.descricao}
                    name="descricao"
                    disabled={this.state.loading}
                    multiline
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
                <DatePicker 
                    inputVariant="outlined" 
                    label="Data de Encerramento" 
                    fullWidth 
                    tipo="datetime"
                    name="termino"
                    value={this.state.evento.termino}
                    onChange={(v)=>{this.changeDate("termino", v)}}
                    disabled={this.state.loading}
                />
                <VisualizarLog log={this.state.evento.ultimoLog} width="100%"/>
                <LeituraButton entidade={this}/>
                <FloatingBox>
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