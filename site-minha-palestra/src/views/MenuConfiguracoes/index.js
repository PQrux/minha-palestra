import React, { Component } from 'react';
import { ResponsiveDivider } from '../../components';
import { Box, Button, Typography } from '@material-ui/core';
import { Perfil } from '../../partialviews';
import { UsuarioHelper, DialogHelper } from '../../services';
import { MeetingRoom, AccountCircle, Info } from '@material-ui/icons';

export default class MenuConfiguracoes extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: 0,
        }
        this.options = [
            {component: <Perfil useCurrentUser showNotFound/>, icon: (<AccountCircle/>), texto: "Meu Perfil"},
            {texto: "Sobre Nós", icon: (<Info/>), action: ()=>{DialogHelper.showDialog("Em construção!", "O recurso ainda não está disponível!", DialogHelper.okButton)}},
            {texto: "SAIR", icon: (<MeetingRoom/>), action: ()=>{UsuarioHelper.desconectar()}},
        ]
    }
    select=(i)=>{
        let selected = this.options[i]||{};
        this.setState({selected: i});
        if(selected.action){
            selected.action();
        }
        else{
            this.changeToRight();
        }
    }
    render() {
        return (
            <ResponsiveDivider style={{height: "100%"}} changeToRightRef={(ref)=>{this.changeToRight = ref}} changeToLeftRef={(ref)=>{this.changeToLeft = ref}}>
                <Box display="flex" flexDirection="column" padding="20px">
                    <Typography align="center" variant="h2" style={{marginBottom: "20px"}}>
                        Ajustes
                    </Typography>
                    {this.options.map(({icon, texto}, i)=>(
                        <Button style={styles.button} variant="outlined" name={i} key={i} color="primary" onClick={()=>{this.select(i)}}>
                            {icon} {texto}
                        </Button>
                    ))}
                </Box>
                {
                    this.options[this.state.selected] && this.options[this.state.selected].component ? this.options[this.state.selected].component : <div></div>
                }
            </ResponsiveDivider>
        );
    }
}
const styles = {
    button: {
        marginBottom: 10,
    }
}