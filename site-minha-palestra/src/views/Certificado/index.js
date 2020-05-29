import React, { Component } from 'react';
import { Palestra } from "models-minha-palestra";
import { Typography, Box, CircularProgress } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
export default class Certificado extends Component {
    state={
        usuarioUid: "",
        palestra: new Palestra("sadasdas/asdasd", "Palestra Legal"),
        erro: false,
    }
    componentDidMount(){
        const params = this.props.location.pathname.split("/"), palestrapath = "Palestras/"+params[2], usuarioUid = params[3];
    }
    render() {
        const { palestra, erro } = this.state;
        if(erro) return (
            <Box style={styles.root} bgcolor="red">
                <ErrorOutline style={{color: "white", fontSize: "50pt"}}/>
                <Typography align="center" style={{color: "white"}}>Erro ao buscar a palestra! Recarregue a página e tente novamente.</Typography>
            </Box>
        )
        else if(!palestra) return (
            <Box style={styles.root}>
                <CircularProgress color="primary"/>
                <Typography align="center">Carregando...</Typography>
            </Box>
        );
        else if(!palestra.participantes[this.state.usuarioUid] || !palestra.participantes[this.state.usuarioUid].compareceu) return (
            <Box style={styles.root} bgcolor="red">

            </Box>
        );
        else return (
            <Box style={styles.root} bgcolor="green">

            </Box>
        );
    }
}
const styles = {
    root: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
}