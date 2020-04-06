import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { UsuarioHelper } from "../../services";

export default class AuthenticationFim extends Component {
    render() {
        return (
                <Box className="DefaultPages_ROOT" justifyContent="center" height="100%" paddingTop="0" paddingBottom="0">
                    <Typography variant="h2" align="center">
                        Parabéns!
                    </Typography>
                    <Typography align="center">
                        Você concluiu o cadastro no Minha Palestra, seja bem-vindo!!!
                    </Typography>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={()=>{this.props.history.push("")}}>
                        VER PALESTRAS
                    </Button>
                </Box>
        );
    }
}
