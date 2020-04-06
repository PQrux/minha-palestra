import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField, DatePicker } from '../../components';
import Authentication from "../Authentication";
import { Usuario } from "models-minha-palestra";
export default class AuthenticationSobreVoce extends Authentication {
    changeDate = (value) =>{
        this.state.usuario.dataNascimento = value;
        this.setState({});
    }
    carregarEntidade(){
        this.setCarregando(false);
        if((this.usuario instanceof Usuario)){
            this.state.usuario = this.usuario;
            if(!this.state.usuario.dataNascimento.getTime||isNaN(this.state.usuario.dataNascimento.getTime())) this.state.usuario.dataNascimento = null;
            this.setCarregando(false);
        }
        else{
            this.props.history.push("");
        }
    }
    carregarEntidade(){
        super.carregarEntidade();
        if(!this.state.usuario.dataNascimento || !this.state.usuario.dataNascimento.getTime()) this.state.usuario.dataNascimento = undefined; 
        this.setState({});
    }
    
    checkInfo = {
        "nome": {type: "string", max: 200, min: 3, aviso: "Insira seu nome completo!"},
        "dataNascimento": {type: "Date", aviso: "Data de nascimento inválida!"},
    }
    nextPage = "cadastroinformacoeslegais";
    renderWrite() {
        return (
                <form className="DefaultPages_ROOT" onSubmit={this.submit}>
                    <Typography align="center">Fale um pouco sobre você:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="Nome Completo" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.usuario.nome} name="nome"
                    />
                    <DatePicker
                        variant="dialog"
                        onChange={this.changeDate}
                        maxDate={maxDate}
                        fullWidth
                        name="dataNascimento"
                        label="Data de Nascimento"
                        inputVariant="outlined"
                        value={this.state.usuario.dataNascimento}
                    />
                    <MaskedTextField
                        onChange={this.change}
                        label="Sobre mim (Opcional)" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.usuario.sobre} name="sobre"
                        multiline
                    />
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" type="submit">
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </form>
        );
    }
}
let cd = new Date();
const maxDate = new Date(cd.getFullYear()-16, cd.getMonth(), cd.getDate());