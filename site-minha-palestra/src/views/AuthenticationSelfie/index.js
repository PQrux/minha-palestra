import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField } from '../../components';

export default class AuthenticationSelfie extends Component {
    state = {
        email: "",
        senha: "",
    }
    render() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography align="center">Para começar, nos informe seu e-mail e uma senha:</Typography>
                    <MaskedTextField
                        onChange={this.change}
                        label="E-mail" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.email} name="email"
                    />
                    <MaskedTextField
                        onChange={this.change}
                        label="Senha" variant="outlined"
                        className="DefaultPages_INPUTS"
                        value={this.state.senha} name="senha"
                    />
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined">
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
