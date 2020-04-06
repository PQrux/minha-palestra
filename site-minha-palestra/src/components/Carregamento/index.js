import React, { Component } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
/**
 * @typedef CarregamentoProps
 * @property {string} texto Texto do carregamento.
 * @property {boolean} preencher Define se o carregamento deve preencher o conteiner.
 * @property {import("@material-ui/core").CircularProgressProps} circularProgressProps Define as propriedades do circular progress.
 * @property {import("@material-ui/core").BoxProps} containerProps Define as propriedades do container do progresso e texto.
 * @property {import("@material-ui/core").TypographyProps} textProps Define as propriedades do texto.
 */
/**
 * @param {CarregamentoProps} props
 */
export default function Carregamento(props){
    let circularProgressProps = props.circularProgressProps ? props.circularProgressProps : {};
    let containerProps = props.containerProps ? props.circularProgressProps : {};
    let textProps = props.textProps ? props.textProps : {};
    return (
        <Box 
            display="flex"
            width={props.preencher ? "100%": undefined} 
            height={props.preencher ? "100%": undefined} 
            justifyContent="center" 
            alignItems="center" 
            flexDirection="column"
            {...containerProps}
        >
            <CircularProgress color="primary" {...circularProgressProps}/>
            <Typography color="textPrimary" {...textProps}>{props.texto||"Carregando..."}</Typography>
        </Box>
    )
}