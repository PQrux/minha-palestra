import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import { MaskedTextField } from '../../components';
import Authentication from '../Authentication';
import Galeria from '../../partialviews/Galeria';
import AuthenticationFim from '../AuthenticationFim';
import { DialogHelper } from '../../services';
const noProfile = require("../../assets/images/no-profile.png");

export default class AuthenticationSelfie extends Authentication {
    nextPage = "";
    submite = () => {
        if(!this.state.usuario.fotoPerfil) this.state.usuario.fotoPerfil = noProfile;
        DialogHelper.showDialog("", <AuthenticationFim />,(
            <Button color="primary" className="DefaultPages_BUTTON" fullWidth variant="outlined" onClick={DialogHelper.closeDialog}>
                VER PALESTRAS
            </Button>
        ));
        this.submit();
    }
    render() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Typography align="center">Para finalizar, que tal colocar uma foto de perfil? Caso não queira, basta clicar em prosseguir.</Typography>
                    <Galeria entidade={this.state.usuario} entidadeProp="fotoPerfil" isNotArray/>
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={this.submite}>
                        PROSSEGUIR
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
