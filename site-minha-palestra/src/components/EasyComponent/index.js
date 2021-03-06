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
    /**
     * 
     * @param {any} props 
     * @param {import("models-minha-palestra/src/models/Permissao")} permissor 
     */
    constructor(props, permissor, mensagemDeny, mensagemNotFound, mensagemLoading, additionalPaperStyle){
        super(props, permissor);
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
            <Box className="DefaultPages_INSIDER easycomponentroot">
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <p>Leitura...</p>
                </Box>
            </Box>
        );
    }
    renderWrite(){
        return (
            <Box className="DefaultPages_INSIDER easycomponentroot">
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <p>Escrita...</p>
                </Box>
            </Box>

        );
    }
    renderNotFound(){
        if(this.props.showNotFound){
            return (
                <Box className="DefaultPages_INSIDER easycomponentroot">
                    <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                        <Search fontSize="large"/>
                        <p>{this.mensagemNotFound}</p>
                    </Box>
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
                <Box className="DefaultPages_INSIDER easycomponentroot">
                    <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                        <ErrorOutline fontSize="large"/>
                        <p>{this.mensagemDeny}</p>
                    </Box>
                </Box>

            );
        }
        else{
            return (<div></div>);
        }
    }
    renderError(){
        return (
            <Box className="DefaultPages_INSIDER easycomponentroot">
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <ErrorOutline fontSize="large"/>
                    <p>{this.erro}</p>
                </Box>
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
            <Box className="DefaultPages_INSIDER easycomponentroot">
                <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                    <CircularProgress/>
                    <p>{this.mensagemLoading}</p>
                </Box>
            </Box>

        );
    }
}
