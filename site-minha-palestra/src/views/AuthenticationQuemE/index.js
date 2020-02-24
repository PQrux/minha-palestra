import React from 'react';
import { Box, Button } from '@material-ui/core';
import Authentication from "../Authentication";
export default class AuthenticationQuemE extends Authentication {
    go = (tipo) => {
        this.props.history.push("cadastroinformacoeslegais", {tipo});
    }
    renderWrite() {
        return (
                <Box className="DefaultPages_ROOT">
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={()=>{this.go("palestrante")}}>
                        Sou um palestrante!
                    </Button>
                    <Button className="DefaultPages_BUTTON" color="secondary" variant="outlined" onClick={()=>{this.go("visitante")}}>
                        Apenas gosto de assistir palestras!
                    </Button>
                    <Button color="primary" className="DefaultPages_BUTTON" variant="outlined" onClick={this.props.history.goBack}>
                        Voltar
                    </Button>
                </Box>
        );
    }
}
