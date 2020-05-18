import React from 'react';
import { List, ResponsiveDivider, SelectibleList, ResponsiveDividerBackButton } from '../../components';
import { VisualizarEspaco } from '../../partialviews';
import { EspacosHelper } from '../../services';
import { Espaco } from "models-minha-palestra";
import { Box } from '@material-ui/core';

export default class EspacosDeApresentacao extends SelectibleList {
    constructor(props){
        super(props);
        this.disablePermissao = true;
    }
    state = {
        selecionado: null,
    }
    carregarEntidade(){
        EspacosHelper.listar(this.props.tipoFiltro, this.props.filtro).then(espacos=>{
            this.espacos = espacos;
            this.setCarregando(false);
        })
        .catch(err=>{
            this.setErro(err.descricao);
        })
    }
    refreshChild = (espaco) => {
        if(!this.espacos.find(espacoss=>espacoss.path === espaco.path)){
            this.espacos.push(espaco);
        }
        this.setState({});
    }
    renderWrite() {
        return (
            <ResponsiveDivider style={{height: "100%"}} noHistory={this.props.noHistory} changeToLeftRef={(ref)=>{this.setState({changeToLeft: ref})}}>
                <List
                    mini
                    tituloLista="Espaços de Apresentação"
                    items={this.espacos}
                    titulo={"nome"}
                    descriptors={[
                        {propriedade: "tipo", orderbyLabel: "Tipo"}, 
                        {label: "Tamanho:", propriedade: "tamanho", orderbyLabel: "Tamanho"},
                    ].concat(this.usuario.grupo === "ADMINISTRADOR" ? [{propriedade: "habilitado", orderbyLabel: "Habilitado", transform: (valor)=>(valor ? "HABILITADO":"DESABILITADO")}]: [])}
                    selected={this.state.selecionado}
                    onItemSelected={this.setSelecionado}
                    tituloLabel={"Nome"}
                    add={this.usuario.grupo === "ADMINISTRADOR" && !this.props.readOnly ? {label: "Adicionar Espaço", onClick: ()=>{this.setSelecionado(new Espaco(undefined, "",  "",  0,  "", "", true))}} : undefined}
                />
                <Box>
                    <ResponsiveDividerBackButton changeToLeft={this.state.changeToLeft}/>
                    <VisualizarEspaco readOnly={this.props.readOnly} refreshParent={this.refreshChild} showNotFound entidade={this.state.selecionado}/>
                </Box>
            </ResponsiveDivider>
        );
    }
}
