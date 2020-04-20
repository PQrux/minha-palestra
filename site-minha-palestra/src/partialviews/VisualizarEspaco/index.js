import { Box, FormControlLabel, MenuItem, Switch, Button } from '@material-ui/core';
import { Espaco } from "models-minha-palestra";
import React from 'react';
import { EasyComponent, MaskedTextField, ResponsiveDividerBackButton, FloatingBox } from '../../components';
import { Permissoes } from "../../constants";
import { DialogHelper, EspacosHelper } from '../../services';
import { Arrayficar } from '../../utils';
import Galeria from '../Galeria';
import VisualizarLog from '../VisualizarLog';

export default class VisualizarEspaco extends EasyComponent {
    constructor(props){
        super(props, Permissoes.espaco);       
        this.state = {
            /**@type {Espaco["prototype"]} */
            espaco: {},
            loading: false,
            modificado: false,
        }
    }
    carregarEntidade(){
        if((this.props.entidade instanceof Espaco)){
            this.setState({espaco: this.props.entidade, modificado: false});
            this.setNotFound(false);
            this.setCarregando(false);
        }
        else{
            this.setNotFound(true);
        }
        
    }
    change = ({target}) => {
        this.state.espaco[target.name] = target.value;
        this.setState({modificado: true});
    }
    salvar = () =>{
        this.setState({loading: true});
        EspacosHelper.salvar(this.state.espaco).then((espaco)=>{
            if(this.props.refreshParent) this.props.refreshParent(espaco);
            this.setState({espaco, modificado: false, loading: false});
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
                <MaskedTextField
                    label="Nome do Espaço"
                    variant="outlined"
                    fullWidth
                    name="nome"
                    value={this.state.espaco.nome}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={this.state.espaco.descricao}
                    name="descricao"
                    disabled={this.state.loading}
                    onChange={this.change}
                />
                <MaskedTextField
                    mask="000"
                    label="Limite de ocupantes"
                    variant="outlined"
                    fullWidth
                    name="limiteDePessoas"
                    value={this.state.espaco.limiteDePessoas}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    label="Tamanho"
                    select
                    fullWidth
                    variant="outlined"
                    name="tamanho"
                    value={this.state.espaco.tamanho}
                    onChange={this.change}
                    disabled={this.state.loading}
                >
                    {Arrayficar(Espaco.tamanhos()).map((item)=>(
                        <MenuItem {...item}>
                            {item.value}
                        </MenuItem>
                    ))}
                </MaskedTextField>
                <MaskedTextField
                    label="Tipo"
                    select
                    fullWidth
                    variant="outlined"
                    name="tipo"
                    value={this.state.espaco.tipo}
                    onChange={this.change}
                    disabled={this.state.loading}
                >
                    {Arrayficar(Espaco.tipos()).map((item)=>(
                        <MenuItem {...item}>
                            {item.value}
                        </MenuItem>
                    ))}
                </MaskedTextField>
                <FormControlLabel
                    style={{alignSelf: "flex-start"}}
                    control={
                    <Switch
                        color="primary"
                        checked={this.state.espaco.habilitado}
                        onChange={()=>{this.state.espaco.habilitado = !this.state.espaco.habilitado; this.setState({modificado: true})}}
                        name="habilitado"
                        disabled={this.state.loading}
                    />
                    }
                    disabled={this.state.loading}
                    label="Habilitado"
                />
                <Galeria entidade={this.state.espaco} entidadeProp="fotos"/>
                <VisualizarLog log={this.state.espaco.ultimoLog} width="100%"/>
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