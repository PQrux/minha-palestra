import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import { Usuario } from "models-minha-palestra";
export default class Perfil extends Component {
    state = {
        usuario: new Usuario(
            "Usuarios/dsadsad32432", Usuario.GRUPOS().ADMINISTRADOR, "guinueb@gmail.com",
            "Antojusco Satãnori", "451.965.378-99", "15289",
            "https://abrilexame.files.wordpress.com/2018/10/8dicas1.jpg",
            "Gosto de assistir palestras", new Date(2000,8,3), new Date(), [], [], new Date(), new Date(), undefined
        )
    }
    render() {
        return (
            <Box>
                
            </Box>
        );
    }
}
