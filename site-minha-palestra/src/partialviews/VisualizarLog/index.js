import { Box, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { DataLocal } from "../../utils";
import "./styles.css";
/**
 * @extends {Component<import("@material-ui/core/Box/Box").BoxProps>}
 */
export default class VisualizarLog extends Component {
    render(){
        /**@type {import("models-minha-palestra/src/models/Log")} */
        let log = this.props.log;
        if(!log) return (<div></div>);
        else
        return (
            <Box className="visualizar_log_root" {...this.props}>
                <Typography variant="h6">Atividade Recente: {log.tipo}</Typography>
                <Box className="visualizar_log_container">
                    <Typography>Usuário: {log.nomeUsuario}</Typography>
                    <Typography>Data: {DataLocal(log.dh)}</Typography>
                </Box>
            </Box>
        )
    }
}
