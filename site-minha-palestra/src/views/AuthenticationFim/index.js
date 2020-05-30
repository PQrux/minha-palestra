import { Box, Typography } from '@material-ui/core';
import React, { Component } from 'react';

export default class AuthenticationFim extends Component {
    render() {
        return (
            <Box className="DefaultPages_ROOT" justifyContent="center" height="100%" paddingTop="0" paddingBottom="0">
                <Typography variant="h2" align="center">
                    Parabéns!
                </Typography>
                <Typography align="center">
                    Você concluiu o cadastro no {window.strings.app_name}, seja bem-vindo!!!
                </Typography>
            </Box>
        );
    }
}
