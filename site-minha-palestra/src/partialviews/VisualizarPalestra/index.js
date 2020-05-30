import { Box, Button, Typography, ThemeProvider, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, ListItemIcon, Link } from '@material-ui/core';
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
        DialogHelper.showConfirmationBox(()=>{
            this.setState({loading: true});
            DialogHelper.showLoading();
            PalestrasHelper.aprovarPalestra(this.state.palestra).then((palestra)=>{
                DialogHelper.closeDialog();
                if(this.props.refreshParent) this.props.refreshParent(palestra);
                this.setState({palestra, modificado: false, loading: false});
            })
            .catch(err=>{
                DialogHelper.showError(err);
                this.setState({loading: false});
            })
        }, "Aprovação de Palestra", "Tem certeza de que deseja aprovar essa palestra?");
    }
    carregarEntidade(){
        this.readOnly = false;
        if((this.props.entidade instanceof Palestra)){
            if(!this.props.entidade.inicio || isNaN(this.props.entidade.inicio.getTime())){
                this.props.entidade.inicio = null;
            }
            if(!this.props.entidade.termino || isNaN(this.props.entidade.termino.getTime())){
                this.props.entidade.termino = null;
            }
            if(this.props.entidade.finalizada || (this.usuario.grupo === "PALESTRANTE" && this.props.entidade.aprovada)){
                this.readOnly = true;
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
    changeEspaco = (novoEspaco) => {
        this.state.palestra.espaco = novoEspaco.path;
        this.salvar();
    }
    changeEvento = (novoEvento) => {
        this.state.palestra.evento = novoEvento.path;
        this.salvar();
    }
    changePalestrante = (novoPalestrante) => {
        this.state.palestra.palestrante = novoPalestrante.path;
        this.state.palestra.nomePalestrante = novoPalestrante.nome;
        this.salvar();
    }
    salvar = () =>{
        this.setState({loading: true});
        PalestrasHelper.salvarPalestra(this.state.palestra).then((palestra)=>{
            if(this.props.refreshParent) this.props.refreshParent(palestra);
            this.setState({palestra, modificado: false, loading: false});
        })
        .catch(err=>{
            console.log(err);
            DialogHelper.showError(err);
            this.setState({loading: false});
        })
    }
    switchInscricao = () =>{
        this.setState({loading: true});
        PalestrasHelper.switchInscricaoEmPalestra(this.state.palestra)
        .then(()=>{
            this.setState({loading: false});
            DialogHelper.showDialog("Sucesso!", `Você foi ${this.state.palestra.participantes[this.usuario.getUid()] ? "inscrito na" : "desinscrito da"} palestra com sucesso!`, DialogHelper.okButton);
        })
        .catch((err)=>{
            this.setState({loading: false});
            DialogHelper.showError(err);
        });
    }
    clonarPalestra = () => {
        Seletor.gerarBusca("palestra", (selecionado)=>{
            if(!selecionado||!(selecionado instanceof Palestra)) return;
            const palestra = this.state.palestra;
            palestra.nome = selecionado.nome;
            palestra.descricao = selecionado.descricao;
            palestra.limiteDeParticipantes = selecionado.limiteDeParticipantes;
            palestra.observacoes = selecionado.observacoes;
            palestra.fotos = selecionado.fotos;
            this.setState({palestra: selecionado, modificado: true}, ()=>this.setState({palestra}));
        }, {tipofiltro: "usuarioCriador", filtro: this.usuario.path});
    }
    gerarPDF = () => {
        this.setState({loading: true});
        DialogHelper.showLoading("Gerando certificado...");
        PalestrasHelper.gerarCerificado(this.state.palestra)
        .then(()=>{
            this.setState({loading: false});
            DialogHelper.showDialog("Sucesso!", "Verifique sua lista de downloads!", DialogHelper.okButton);
        })
        .catch((err)=>{
            this.setState({loading: false});
            DialogHelper.showError(err);
        });
    }
    finalizarPalestra = () => {
        const {palestra} = this.state;
        let body;
        const change = (participante) => {
            console.log("vai krl");
            participante.compareceu = !participante.compareceu; 
            console.log(participante);
            this.setState({});
            DialogHelper.updateDialogBody(body());
        }
        body = () => (
            <List>
                {Object.getOwnPropertyNames(palestra.participantes||{}).map(key=>(
                    <ListItem key={key} button onClick={()=>change(palestra.participantes[key])}>
                        <ListItemText primary={palestra.participantes[key].nome}/>
                        <ListItemIcon >
                            <Checkbox checked={palestra.participantes[key].compareceu}/>
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>
        )
        DialogHelper.showDialog(<Typography align="center" variant="h6">Faça a Chamada</Typography>, body(),(
            <Box>
                <Button onClick={DialogHelper.closeDialog}>CANCELAR</Button>
                <Button 
                    color="primary"
                    onClick={()=>{
                        DialogHelper.showConfirmationBox(()=>{
                            DialogHelper.showLoading();
                            PalestrasHelper.finalizarPalestra(palestra)
                            .then(()=>{
                                DialogHelper.showDialog("Concluído!", "Palestra encerrada com sucesso!", DialogHelper.okButton);
                                this.setState({});
                            })
                            .catch(DialogHelper.showError);
                        }, "CONFIRMAÇÃO", "Tem certeza de que deseja encerrar a palestra?");
                    }}
                >
                    CONCLUIR
                </Button>
            </Box>
        ))
    }
    renderFinalizar = () =>{
        if(!this.state.palestra.finalizada && this.state.palestra.aprovada && (this.usuario.grupo === "ADMINISTRADOR" || this.state.palestra.palestrante === this.usuario.path))
        return(
            <Button color="primary" variant="contained" style={{alignSelf: "center"}} onClick={this.finalizarPalestra}>
                Finalizar Palestra
            </Button>
        )
    }
    renderRead(){
        return (
            <Box className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT">
                    <Typography align="center" variant="h3">
                        {this.state.palestra.nome}
                    </Typography>
                    <Box display="flex" flexDirection="column">
                        <Galeria readOnly entidade={this.state.palestra} entidadeProp="fotos"/>
                    </Box>
                    <Box className="default_border" width="100%">
                        <Box padding="10px">
                            <Typography variant="h6">
                                Informações
                            </Typography>
                            <Box bgcolor="#EEE" className="default_border" padding="10px">
                                { this.state.palestra.descricao ?
                                <Typography >
                                    <b>DESCRIÇÃO:</b><br/>
                                    {this.state.palestra.descricao}
                                </Typography>: undefined
                                }
                                {
                                    this.state.palestra.dhApresentacao ?
                                    <Typography>
                                        <b>APRESENTAÇÃO EM: </b>{DataLocal(this.state.palestra.dhApresentacao)}
                                    </Typography>:undefined
                                }
                                {
                                    this.state.palestra.dhFinalizacao ?
                                    <Typography>
                                        <b>FINALIZADA EM: </b>{DataLocal(this.state.palestra.dhFinalizacao)}
                                    </Typography>: undefined
                                }
                                {
                                    this.state.palestra.limiteDeParticipantes ?
                                    <Typography>
                                        {parseInt(this.state.palestra.limiteDeParticipantes) - Object.getOwnPropertyNames(this.state.palestra.participantes||{}).length} Vagas restantes 
                                    </Typography>: undefined
                                }
                            </Box>
                        </Box>
                    </Box>

                    <Seletor BoxProps={{width: "100%"}} tipo="usuario" entidade={this.state.palestra.palestrante} readOnly/>
                    <Seletor BoxProps={{width: "100%"}} tipo="espaco" entidade={this.state.palestra.espaco} readOnly/>
                    {this.renderFinalizar()}
                    {
                        this.state.palestra.aprovada && !this.state.palestra.cancelada && !this.state.palestra.finalizada && this.state.palestra.palestrante !== this.usuario.path ?
                        <ThemeProvider theme={Themes.info}>
                            <Button disabled={this.state.loading} onClick={this.switchInscricao} variant="contained" color={this.state.palestra.participantes[this.usuario.getUid()] ? "secondary" : "primary"}>
                                {this.state.palestra.participantes && this.state.palestra.participantes[this.usuario.getUid()] ? "REMOVER INSCRIÇÃO" : "INSCREVER-ME"}
                            </Button>
                        </ThemeProvider>
                        :undefined
                    }
                    {
                        this.state.palestra.participantes && this.state.palestra.participantes[this.usuario.getUid()] && this.state.palestra.participantes[this.usuario.getUid()].compareceu ?
                        <Button color="primary" variant="contained" onClick={this.gerarPDF} disabled={this.state.loading}>
                            GERAR CERTIFICADO
                        </Button> : undefined
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
                {
                    !this.state.palestra.path ?
                    <Typography>
                        Dica: Está cansado de digitar? Copie as informações essenciais de uma palestra anterior clicando
                        <Link color="primary" onClick={this.clonarPalestra}> AQUI.</Link>
                    </Typography>: undefined
                }
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
                <Galeria entidade={this.state.palestra} entidadeProp="fotos" refreshParent={()=>this.setState({modificado: true})}/>
                {
                    this.usuario.grupo === "ADMINISTRADOR" ? undefined : 
                    <Typography variant="caption">
                        As observações serão exibidas somente ao administrador, solicite abaixo equipamentos, laboratórios ou qualquer necessidade que pode ser suprida pela organização. 
                    </Typography>
                }
                <MaskedTextField
                    label="Observações para aprovação (Opcional)"
                    variant="outlined"
                    fullWidth
                    value={this.state.palestra.observacoes}
                    name="observacoes"
                    disabled={this.state.loading}
                    multiline
                    onChange={this.change}
                />
                {
                    this.usuario.grupo !== "ADMINISTRADOR" ? undefined : 
                    <Box className="DefaultPages_ROOT" width="100%">
                        <Seletor readOnly={!this.state.palestra.path} BoxProps={{width: "100%"}} tipo="usuario" entidade={this.state.palestra.palestrante} onSelecionado={this.changePalestrante} listProps={{tipoFiltro: "grupo", filtro: "PALESTRANTE"}}/>
                        <Seletor readOnly={!this.state.palestra.path} BoxProps={{width: "100%"}} tipo="espaco" entidade={this.state.palestra.espaco} onSelecionado={this.changeEspaco} listProps={{tipoFiltro: "habilitado", filtro: true}}/>
                        <Seletor readOnly={!this.state.palestra.path} BoxProps={{width: "100%"}} tipo="evento" entidade={this.state.palestra.evento} onSelecionado={this.changeEvento}/>
                    </Box>
                }
                {
                    !this.state.palestra.aprovada && !this.state.palestra.cancelada && !this.state.palestra.finalizada ?
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={this.aprovarPalestra}
                        disabled={this.state.loading}
                        style={{marginLeft: 10, display: this.state.palestra.path && !this.state.palestra.cancelada && !this.state.palestra.finalizada ? "block" : "none"}}
                    >
                        Aprovar Palestra
                    </Button> : undefined
                }
                {this.renderFinalizar()}
                {
                    !this.state.palestra.cancelada && !this.state.palestra.finalizada ?
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={this.cancelarPalestra}
                        disabled={this.state.loading}
                        style={{marginLeft: 10, display: this.state.palestra.path && !this.state.palestra.cancelada && !this.state.palestra.finalizada ? "block" : "none"}}
                    >
                        Cancelar Palestra
                    </Button> : undefined
                }
                <VisualizarLog log={this.state.palestra.ultimoLog} width="100%"/>
                <LeituraButton disabled={this.state.palestra.finalizada} entidade={this}/>
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
