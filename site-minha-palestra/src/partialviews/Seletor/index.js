import { Box, Button, Typography } from '@material-ui/core';
import { Permissao, Resultado } from "models-minha-palestra";
import React from 'react';
import { EasyComponent } from '../../components';
import { Permissoes } from '../../constants';
import { DialogHelper, EspacosHelper, EventosHelper, UsuarioHelper } from '../../services';
import { EspacosDeApresentacao, Eventos, Palestras, Usuarios } from '../../views';
import Perfil from '../Perfil';
import VisualizarEspaco from '../VisualizarEspaco';
import VisualizarEvento from '../VisualizarEvento';
import "./styles.css";

export default class Seletor extends EasyComponent {
    constructor(props){
        super(props, new Permissao({}));
        switch(this.props.tipo){
            case "usuario":this.permissor = Permissoes.selecionar_palestrante;break;
            case "evento":this.permissor = Permissoes.selecionar_evento;break;
            case "espaco":this.permissor = Permissoes.selecionar_espaco;break;
            default: throw new Resultado(-2, "Erro! Defina um tipo de seletor.");
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
                    throw new Resultado(-2, "Erro! Tipo inválido.");
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
            case "usuario":return (<Perfil minimal readOnly entidade={this.state.selecionado}/>);
            case "evento":return (<VisualizarEvento minimal readOnly entidade={this.state.selecionado}/>);
            case "espaco":return (<VisualizarEspaco minimal readOnly entidade={this.state.selecionado}/>);
            default: throw new Resultado(-2, "Erro! Tipo inválido.");
        }
    }
    selecionar = () => {
        Seletor.gerarBusca(this.props.tipo, (selecionado)=>{
            if(selecionado){
                this.setState({selecionado});
                if(this.props.onSelecionado) this.props.onSelecionado(selecionado);
            }
        }, this.props.listProps);
    }
    /**
     * 
     * @param {"usuario"|"evento"|"espaco"|"palestra"} tipo 
     * @param {function(selecionado)} callback 
     */
    static gerarBusca(tipo, callback, listProps){
        let selecionado, selector;
        listProps=listProps||{};
        const selecionar=(selecao)=>{
            selecionado = selecao;
        },
        onClick=(cancel)=>{
            DialogHelper.closeDialog();
            callback(cancel ? undefined : selecionado);
        }
        switch(tipo){
            case "usuario":selector = (<Usuarios noHistory readOnly onSelecionado={selecionar} {...listProps}/>);break;
            case "evento":selector = (<Eventos noHistory readOnly onSelecionado={selecionar} {...listProps}/>);break;
            case "espaco":selector = (<EspacosDeApresentacao noHistory readOnly onSelecionado={selecionar} {...listProps}/>);break;
            case "palestra":selector = (<Palestras noHistory readOnly onSelecionado={selecionar} {...listProps}/>);break;
            default: throw new Resultado(-2, "Erro! Tipo inválido.");
        }

        DialogHelper.showDialog(null, selector, 
            <Box display="flex">
                <Button color="secondary" variant="outlined" onClick={()=>onClick(true)}>
                    CANCELAR
                </Button>
                <Button style={{marginLeft: 10}} color="primary" variant="contained" onClick={()=>onClick(false)}> 
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
