import { Box, Button, Typography, ThemeProvider } from '@material-ui/core';
import { Palestra } from "models-minha-palestra";
import React from 'react';
import { DatePicker, EasyComponent, FloatingBox, MaskedTextField, ResponsiveDividerBackButton, LeituraButton } from '../../components';
import { Permissoes, Themes } from "../../constants";
import { DialogHelper } from '../../services';
import { DataLocal } from '../../utils';
import VisualizarLog from '../VisualizarLog';
import PalestrasHelper from '../../services/PalestrasHelper';
import Galeria from '../Galeria';
import Seletor from '../Seletor';

export default class VisualizarPalestra extends EasyComponent {
    constructor(props){
        super(props, Permissoes.palestra);       
        this.state = {
            /**@type {Palestra["prototype"]} */
            palestra: {},
            loading: false,
            modificado: false,
        }
    }
    cancelarPalestra = () => {
        DialogHelper.showConfirmationBox(()=>{
            this.setState({loading: true});
            DialogHelper.showLoading();
            PalestrasHelper.cancelarPalestra(this.state.palestra).then((palestra)=>{
                DialogHelper.closeDialog();
                if(this.props.refreshParent) this.props.refreshParent(palestra);
                this.readOnly = true;
                this.setState({palestra, modificado: false, loading: false});
            })
            .catch(err=>{
                DialogHelper.showError(err);
                this.setState({loading: false});
            })
        }, "Cancelamento de Palestra", "Tem certeza de que deseja cancelar essa palestra? Essa ação não pode ser desfeita.");
    }
    aprovarPalestra = () => {

    }
    carregarEntidade(){
        if((this.props.entidade instanceof Palestra)){
            if(!this.props.entidade.inicio || isNaN(this.props.entidade.inicio.getTime())){
                this.props.entidade.inicio = null;
            }
            if(!this.props.entidade.termino || isNaN(this.props.entidade.termino.getTime())){
                this.props.entidade.termino = null;
            }
            this.setState({palestra: this.props.entidade, modificado: false});
            this.setNotFound(false);
            this.setCarregando(false);
        }
        else{
            this.setNotFound(true);
        }
    }
    change = ({target}) => {
        this.state.palestra[target.name] = target.value;
        this.setState({modificado: true});
    }
    changeDate = (prop,value) =>{
        this.state.palestra[prop] = value;
        this.setState({modificado: true});
    }
    salvar = () =>{
        this.setState({loading: true});
        PalestrasHelper.salvarPalestra(this.state.palestra).then((palestra)=>{
            if(this.props.refreshParent) this.props.refreshParent(palestra);
            this.setState({palestra, modificado: false, loading: false});
        })
        .catch(err=>{
            DialogHelper.showError(err);
            this.setState({loading: false});
        })
    }
    switchInscricao(){

    }
    renderRead(){
        return (
            <Box className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT">
                    <Typography align="center" variant="h3">
                        {this.state.palestra.nome}
                    </Typography>
                    <Typography align="center">
                        {this.state.palestra.descricao}
                    </Typography>
                    {
                        this.state.palestra.limiteDeParticipantes ?
                        <Typography>
                            {parseInt(this.state.palestra.limiteDeParticipantes) - Object.getOwnPropertyNames(this.state.palestra.participantes||{}).length} Vagas restantes 
                        </Typography>: undefined
                    }
                    <Typography>
                        Apresentação em: {DataLocal(this.state.palestra.dhApresentacao)}
                    </Typography>
                    {
                        this.state.palestra.aprovada && !this.state.palestra.cancelada && !this.state.palestra.finalizada ?
                        <ThemeProvider theme={Themes.error}>
                            <Button disabled={this.state.loading} onClick={this.switchInscricao} variant="contained" color={this.state.palestra.participantes[this.usuario.getUid()] ? "secondary" : "primary"}>
                                {this.state.palestra.participantes && this.state.palestra.participantes[this.usuario.path.split("/").pop()] ? "REMOVER INSCRIÇÃO" : "INSCREVER-ME"}
                            </Button>
                        </ThemeProvider>
                        :undefined
                    }
                    <LeituraButton disabled={this.state.palestra.finalizada} entidade={this}/>
                </Box>
            </Box>
        )
    }
    renderWrite() {
        return (
        <Box className="DefaultPages_INSIDER">
            <Box className="DefaultPages_ROOT">
                <MaskedTextField
                    label="Nome da Palestra"
                    variant="outlined"
                    fullWidth
                    name="nome"
                    value={this.state.palestra.nome}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    value={this.state.palestra.descricao}
                    name="descricao"
                    disabled={this.state.loading}
                    multiline
                    onChange={this.change}
                />
                <MaskedTextField
                    mask="000"
                    label="Limite de participantes (Opcional)"
                    variant="outlined"
                    fullWidth
                    name="limiteDeParticipantes"
                    value={this.state.palestra.limiteDeParticipantes}
                    onChange={this.change}
                    disabled={this.state.loading}
                />
                <DatePicker 
                    inputVariant="outlined" 
                    label="Data de Apresentação"
                    fullWidth 
                    tipo="datetime"
                    name="dhApresentacao"
                    value={this.state.palestra.dhApresentacao}
                    onChange={(v)=>{this.changeDate("dhApresentacao", v)}}
                    disabled={this.state.loading}
                />
                <Galeria entidade={this.state.palestra} entidadeProp="fotos"/>
                <Seletor BoxProps={{width: "100%"}} tipo="usuario" entidade={this.state.palestra.palestrante}/>
                <Seletor BoxProps={{width: "100%"}} tipo="espaco" entidade={this.state.palestra.espaco}/>
                <Seletor BoxProps={{width: "100%"}} tipo="evento" entidade={this.state.palestra.evento}/>
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={this.aprovarPalestra}
                    disabled={this.state.loading}
                    style={{marginLeft: 10, display: this.state.palestra.path && !this.state.palestra.cancelada && !this.state.palestra.finalizada ? "block" : "none"}}
                >
                    Aprovar Palestra
                </Button>
                <Button 
                    variant="contained"
                    color="secondary"
                    onClick={this.cancelarPalestra}
                    disabled={this.state.loading}
                    style={{marginLeft: 10, display: this.state.palestra.path && !this.state.palestra.cancelada && !this.state.palestra.finalizada ? "block" : "none"}}
                >
                    Cancelar Palestra
                </Button>
                <VisualizarLog log={this.state.palestra.ultimoLog} width="100%"/>
                <LeituraButton disabled={this.state.palestra.finalizada} entidade={this}/>
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
