import { Box, FormControlLabel, MenuItem, Switch, Button, Typography, ListItem, List, Divider } from '@material-ui/core';
import { Espaco } from "models-minha-palestra";
import React from 'react';
import { EasyComponent, MaskedTextField, ResponsiveDividerBackButton, FloatingBox } from '../../components';
import { Permissoes } from "../../constants";
import { DialogHelper, EspacosHelper } from '../../services';
import { Arrayficar, DataLocal } from '../../utils';
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
            palestras: undefined,
        }
    }
    carregarEntidade(){
        this.setCarregando(true);
        if((this.props.entidade instanceof Espaco)){
            this.setState({espaco: this.props.entidade, modificado: false});
            this.setNotFound(false);
            this.setCarregando(false);
            this.carregarPalestras(this.props.entidade);
        }
        else{
            this.setNotFound(true);
        }    
    }
    carregarPalestras = (espaco) => {
        this.setState({palestras: undefined});
        EspacosHelper.capturarPalestrasDoEspaco(espaco)
        .then(palestras=>{
            this.setState({palestras});
        })
        .catch((err)=>{
            console.log(err);
            this.setState({palestras: []});
        })
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
    renderMinimal(){
        return (
            <Box>
                <Typography style={{textTransform: "uppercase"}}>
                    {this.state.espaco.nome}
                </Typography>
                <Typography>{this.state.espaco.tipo} - {this.state.espaco.tamanho}</Typography>
                <Typography>{this.state.espaco.descricao}</Typography>
                <Galeria entidade={this.state.espaco} entidadeProp="fotos" readOnly/>
            </Box>
        )
    }
    renderPalestras(){
        /**@type {Array<import("models-minha-palestra/src/models/Palestra")>} */
        const palestras = this.state.palestras;
        const boxProps = {className:"default_border", width: "100%"};
        if(!palestras)
        return (
            <Box {...boxProps}>
                <Box padding="10px">
                    <Typography align="center">Buscando Palestras...</Typography>
                </Box>
            </Box>
        );
        else if(palestras && palestras.length <= 0)
        return (
            <Box {...boxProps}>
                <Box padding="10px">
                    <Typography align="center">Não há nenhuma palestra vinculada à esse espaço no momento!</Typography>
                </Box>
            </Box>
        );
        else
        return (
            <Box {...boxProps}>
                <Box padding="10px">
                    <Typography align="center">Palestras que utilizarão esse espaço:</Typography>
                    <List>
                        {
                            palestras.map((p,i)=>(
                                <Box>
                                    <Divider/>
                                    <ListItem key={i} alignItems="center">
                                        {p.nome} - {DataLocal(p.dhApresentacao)}
                                    </ListItem>
                                </Box>
                            ))
                        }
                    </List>
                </Box>
            </Box>
        );
    }
    renderRead(){
        if(this.props.minimal)
        return (this.renderMinimal());
        return(
            <Box className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT" justifyContent="center">
                    <Typography variant="h3">{this.state.espaco.nome}</Typography>
                    <Typography>{this.state.espaco.descricao}</Typography>
                    <Typography>{this.state.espaco.tipo} - {this.state.espaco.tamanho}</Typography>
                    <Typography>{this.state.espaco.limiteDePessoas} Lugares disponíveis</Typography>
                    <Galeria entidade={this.state.espaco} entidadeProp="fotos" readOnly/>
                    {this.renderPalestras()}
                </Box>
            </Box>
        )
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
                {this.renderPalestras()}
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