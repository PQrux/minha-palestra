import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField } from '../../components';
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
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.submit}>
                        {"PROSSEGUIR"}
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
