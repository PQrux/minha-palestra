import { Box, Button, Divider, Typography } from '@material-ui/core';
import { AccountCircle, Info, MeetingRoom } from '@material-ui/icons';
import React from 'react';
import { EasyComponent, ResponsiveDivider } from '../../components';
import { Perfil } from '../../partialviews';
import { DialogHelper, UsuarioHelper } from '../../services';

export default class MenuConfiguracoes extends EasyComponent {
    constructor(props){
        super(props);
        this.disablePermissao = true;
        this.state = {
            selected: 0,
        }
        this.options = [
            {component: <Perfil useCurrentUser showNotFound/>, icon: (<AccountCircle/>), texto: "Meu Perfil"},
            {texto: "Política de Privacidade", icon: (<Info/>), action: ()=>{DialogHelper.showDialog("Política de Privacidade", <Typography align="justify">{window.strings.politica_de_privacidade}</Typography>, DialogHelper.okButton)}},
            {texto: "SAIR", icon: (<MeetingRoom/>), action: ()=>{UsuarioHelper.desconectar()}},
        ];
        this.adminOptions = this.props.adminOptions;
    }
    carregarEntidade(){
        this.setCarregando(false);
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
                    {this.options.map(({icon, texto}, i)=>(
                        <Button style={styles.button} variant="outlined" name={i} key={i} color="primary" onClick={()=>{this.select(i)}}>
                            {icon} {texto}
                        </Button>
                    ))}
                    {
                        this.usuario.grupo === "ADMINISTRADOR" ?
                        <Box display="flex" flexDirection="column">
                            <Divider style={{marginBottom: "10px"}}/>
                            {this.adminOptions.map(o=>(
                                <Button style={styles.button} variant="outlined" key={o.path} color="primary" onClick={()=>{this.props.history.push(o.path)}}>
                                    {o.icon} {o.label}
                                </Button>
                            ))}
                        </Box> : undefined
                    }
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