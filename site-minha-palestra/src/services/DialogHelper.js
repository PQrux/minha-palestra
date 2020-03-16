import { multiStorager } from "../utils";
import React from 'react';
import { Button, CircularProgress, Box } from '@material-ui/core';

export default class DialogHelper{
    /**
     * 
     * @param {String} title Título do dialog.
     * @param {import("@babel/types").JSXElement} body Corpo do dialog.
     * @param {import("@babel/types").JSXElement} buttons botões do dialog.
     * @param {boolean} locked Define se o dialog pode ser dissipado com o clique fora ou se deve ser dissipado manualmente.
     */
    static showDialog(title, body, buttons, locked){
        const show = multiStorager.getOtherDataStorager("dialog").get("showDialog");
        if(show){
            show(title,body,buttons,locked);
        }
    }
    static closeDialog(){
        const close = multiStorager.getOtherDataStorager("dialog").get("closeDialog");
        if(close){
            close();
        }
    }
    static updateDialogBody(body){
        const update = multiStorager.getOtherDataStorager("dialog").get("updateDialogBody");
        if(update){
            update(body);
        }
    }
    /**@param {any} resultado */
    static showError(resultado){
        DialogHelper.showDialog("Erro!", resultado.descricao, DialogHelper.okButton);
    }
    static showLoading(customText){
        DialogHelper.showDialog(customText||"Salvando...",<CircularProgress style={{alignSelf: "center"}}></CircularProgress>,"",true);
    }
    /**
     * 
     * @param {function} confirmCallback 
     * @param {string=} title 
     * @param {string=} text 
     */
    static showConfirmationBox(confirmCallback, title, text){
        DialogHelper.showDialog(
            title||"Tem certeza disso?",
            text||"Tem certeza de que deseja realizar essa operação?",
            (
                <Box>
                    <Button onClick={()=>{DialogHelper.closeDialog()}}>
                        NÃO
                    </Button>
                    <Button onClick={()=>{confirmCallback()}} color="primary">
                        SIM
                    </Button>
                </Box>
            )
        )
    }
    static okButton = (<Button onClick={()=>{DialogHelper.closeDialog()}}>OK</Button>)
} 