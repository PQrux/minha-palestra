import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { DataLocal } from "../../utils";
import "./styles.css";
import { Permissao } from "models-minha-palestra";
import { EasyComponent } from '../../components';
import { Permissoes } from "../../constants";

export default class VisualizarLog extends EasyComponent {
    constructor(props){
        super(props, Permissoes.log);
    }
    carregarEntidade(){
        this.setCarregando(false);
    }
    renderWrite(){
        return this.renderRead();
    }
    renderRead(){
        /**@type {import("models-minha-palestra/src/models/Log")} */
        let log = this.props.log;
        if(!log) return (<div></div>);
        else
        return (
            <Box className="visualizar_log_root" {...this.props}>
                <Box className="visualizar_log_subroot">
                    <Typography variant="h6">Atividade Recente: {log.tipo}</Typography>
                    <Box className="visualizar_log_container">
                        <Typography>Usuário: {log.nomeUsuario}</Typography>
                        <Typography>Data: {DataLocal(log.dh)}</Typography>
                    </Box>
                </Box>
            </Box>
        )
    }
}
