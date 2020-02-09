import React from 'react';
import { CircularProgress, Button, Box } from "@material-ui/core";
import PureEasyComponent from "../PureEasyComponent";
import { ErrorOutline, Search } from "@material-ui/icons";
import "./style.css";
import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

const greenTheme = createMuiTheme({
    palette: {
        primary: green,
    },
})

export default class EasyComponent extends PureEasyComponent {
    constructor(props, nomePermissao, mensagemDeny, mensagemNotFound, mensagemLoading, additionalPaperStyle){
        super(props, nomePermissao);
        this.mensagemNotFound = mensagemNotFound||"Recurso não encontrado.";
        this.mensagemDeny = mensagemDeny||"Você não possui permissão para acessar esse recurso!";
        this.mensagemLoading = mensagemLoading||"Carregando...";
        this.additionalPaperStyle = additionalPaperStyle;
    }
    carregarEntidade(){
        this.setCarregando(false);
    }
    renderRead(){
        return (
            <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                <p>Leitura...</p>
            </Box>
        );
    }
    renderWrite(){
        return (
            <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                <p>Escrita...</p>
            </Box>
        );
    }
    renderNotFound(){
        if(this.props.showNotFound){
            return (
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <Search fontSize="large"/>
                    <p>{this.mensagemNotFound}</p>
                </Box>
            );
        }
        else{
            return (<div></div>);
        }
    }
    renderDeny(){
        if(this.props.showDeny){
            return (
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <ErrorOutline fontSize="large"/>
                    <p>{this.mensagemDeny}</p>
                </Box>
            );
        }
        else{
            return (<div></div>);
        }
    }
    renderError(){
        return (
            <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                <ErrorOutline fontSize="large"/>
                <p>{this.erro}</p>
            </Box>
        );
    }
    saveButton(callback, disabled, loading, invisible){
        if(!invisible)
        return (
            <ThemeProvider theme={greenTheme}>
            <Button variant="outlined" color="primary" onClick={callback} disabled={disabled||loading}>
                {loading ? <CircularProgress/> : "SALVAR"}
            </Button>
            </ThemeProvider>
        )
    }
    renderLoading(){
        return (
            <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                <CircularProgress/>
                <p>{this.mensagemLoading}</p>
            </Box>
        );
    }
}
