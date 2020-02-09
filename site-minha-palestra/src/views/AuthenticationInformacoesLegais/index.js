import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField, DatePicker } from '../../components';
import Authentication from "../Authentication";
export default class AuthenticationInformacoesLegais extends Authentication {
    changeDate = (value) =>{
        this.state.usuario.dataNascimento = value;
        this.setState({});
    }
    submitPalestrante = () => {
        this.submit();
    }
    nextPage = "cadastroconcluido";
    changeApelo = ({target}) => {
        this.setState({apelo: target.value});
    }
    renderWrite() {
        const state = this.props.location.state||{};
        const tipo = state.tipo;
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography align="center">Só precisamos de mais algumas informações:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="CPF" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.usuario.cpf} name="cpf"
                        mask="000.000.000.00"
                    />
                    <Typography variant="caption">
                        Seu CPF será utilizado apenas para lhe identificar em seus 
                        certificados e dentro do sistema.
                    </Typography>
                    {tipo === "aluno" ? 
                        (
                            <MaskedTextField
                                onChange={this.change}
                                label="Registro Acadêmico" variant="outlined"
                                className="DefaultPages_INPUTS"
                                value={this.state.usuario.registroAcademico} name="registroAcademico"
                            />
                        )
                    : undefined}
                    {tipo === "palestrante" ? 
                        (
                            <Box>
                                <hr color="black" size={1}></hr>
                                <Typography align="justify" style={{marginBottom: "10px"}}>
                                    para que você possa se tornar um palestrante, é necessário redigir um apelo, solicitando ao 
                                    administrador para que o mesmo lhe conceda esse acesso, fale sobre sua experiência como 
                                    palestrante e área de atuação:
                                </Typography>
                                <MaskedTextField
                                    onChange={this.change}
                                    label="Apelo" variant="outlined"
                                    className="DefaultPages_INPUTS"
                                    value={this.state.apelo} name="apelo"
                                    multiline
                                />
                            </Box>
                        )
                    : undefined}
                    {tipo === "palestrante" ? 
                        (
                        <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.submitPalestrante}>
                            PROSSEGUIR
                        </Button>
                        )
                    : undefined}
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.submit}>
                        {tipo === "palestrante" ? "Preencher Solicitação mais tarde" : "PROSSEGUIR"}
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
