import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField, DatePicker } from '../../components';
import Authentication from "../Authentication";
export default class AuthenticationSobreVoce extends Authentication {
    changeDate = (value) =>{
        this.state.usuario.dataNascimento = value;
        this.setState({});
    }
    carregarEntidade(){
        super.carregarEntidade();
        if(!this.state.usuario.dataNascimento || !this.state.usuario.dataNascimento.getTime()) this.state.usuario.dataNascimento = undefined; 
        this.setState({});
    }
    nextPage = "cadastroqueme";
    renderWrite() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography align="center">Fale um pouco sobre você:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="Nome" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.usuario.nome} name="nome"
                    />
                    <DatePicker
                        variant="dialog"
                        onChange={this.changeDate}
                        disableFuture
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
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.submit}>
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
