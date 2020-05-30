import React, { Component } from 'react';
import { Palestra } from "models-minha-palestra";
import { Typography, Box, CircularProgress, Button, ThemeProvider, Fab } from '@material-ui/core';
import { ErrorOutline, KeyboardArrowLeft, Clear, Check } from '@material-ui/icons';
import { Themes } from '../../constants';
import "./styles.css";
import { VisualizarPalestra } from '../../partialviews';
import { DataLocal } from '../../utils';
import { PalestrasHelper } from '../../services';
export default class Certificado extends Component {
    state={
        usuarioUid: "",
        palestra: undefined,
        erro: false,
    }
    componentDidMount(){
        const params = this.props.location.pathname.split("/"), palestrapath = "Palestras/"+params[2], usuarioUid = params[3];
        PalestrasHelper.buscarPalestra(palestrapath).then(palestra=>this.setState({palestra, usuarioUid}))
        .catch(err=>{
            console.log({err});
            this.setState({erro: true});
        })
    }
    botaoVoltar = (color) => (
        <Button color={color} variant="outlined" onClick={()=>this.props.history.push("")}>
            <KeyboardArrowLeft/>
            VOLTAR AO INÍCIO
        </Button>
    )
    render() {
        const { palestra, erro } = this.state;
        if(erro) return (
            <Box className="Certificado_root" bgcolor="red">
                <ErrorOutline style={{color: "white", fontSize: "50pt"}}/>
                <Typography align="center" style={{color: "white"}}>Erro ao buscar a palestra! Recarregue a página e tente novamente.</Typography>
            </Box>
        )
        else if(!palestra) return (
            <Box className="Certificado_root">
                <CircularProgress color="primary"/>
                <Typography align="center">Carregando...</Typography>
            </Box>
        );
        else if(!palestra.participantes[this.state.usuarioUid] || !palestra.participantes[this.state.usuarioUid].compareceu) return (
            <ThemeProvider theme={Themes.info}>
                <Box className="Certificado_root">
                    <Fab color="secondary">
                        <Clear/>
                    </Fab>
                    <Typography variant="h4" color="secondary" align="center">
                        O usuário solicitado não participou da palestra: {this.state.palestra.nome}.
                    </Typography>
                    {this.botaoVoltar("secondary")}
                </Box>
            </ThemeProvider>
        );
        else return (
            <ThemeProvider theme={Themes.info}>
                <Box className="Certificado_root">
                    <Fab color="primary">
                        <Check/>
                    </Fab>
                    <Typography variant="h4" color="primary" align="center">
                        {palestra.participantes[this.state.usuarioUid].nome} participou da palestra: {palestra.nome}!
                    </Typography>
                    <Typography>
                        A palestra foi apresentada em {DataLocal(palestra.dhApresentacao)} e ministrada por {palestra.nomePalestrante}. 
                    </Typography>
                    {this.botaoVoltar("primary")}
                </Box>
            </ThemeProvider>
            
        );
    }
}