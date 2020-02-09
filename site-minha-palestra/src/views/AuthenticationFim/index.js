import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { UsuarioHelper } from "../../services";

export default class AuthenticationFim extends Component {
    state = {
        email: "",
        senha: "",
    }
    render() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography variant="h2" align="center">
                        Parabéns!
                    </Typography>
                    <Typography align="center">
                        Você concluiu o cadastro no Minha Palestra, seja bem-vindo!!!
                    </Typography>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined">
                        VER PALESTRAS
                    </Button>
                    <Button color="secondary" className="DefaultPages_BUTTON" variant="outlined" onClick={UsuarioHelper.desconectar}>
                        SAIR
                    </Button>
                </Box>
        );
    }
}
