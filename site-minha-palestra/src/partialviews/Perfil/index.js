import { Box, Button, Typography } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { Usuario } from "models-minha-palestra";
import React from 'react';
import { DatePicker, EasyComponent, MaskedTextField } from '../../components';
import { UsuarioHelper } from '../../services';
import VisualizarLog from '../VisualizarLog';
const logo = require("../../assets/images/logo.png");
export default class Perfil extends EasyComponent {
    constructor(props){
        super(props, "Usuarios", "Você não tem permissão para visualizar usuários.", "Nenhum usuário selecionado.",
        undefined, {minHeight: "100%"});
        this.state = {
            /**@type {Usuario["prototype"]} */
            usuario: {},
            loading: false,
            modificado: false,
        }
    }
    carregarEntidade(){
        if(this.props.useCurrentUser){
            this.disablePermissao = true;
            this.setState({usuario: this.usuario});
            this.setCarregando(false);
        }
        else if(typeof this.props.entidade === "string"){
            this.setNotFound(true);
        }
        else if(this.props.entidade instanceof Usuario){
            this.setState({usuario: this.props.entidade});
            this.setCarregando(false);
        }
        else{
            this.setNotFound(true);
        }
    }
    renderError(){
        return (
            <Box className="easycomponentpaper horizontal vertical center" style={this.additionalPaperStyle}>
                <ErrorOutline fontSize="large"/>
                <p>{this.erro}</p>
                <Button onClick={()=>{this.setErro(false)}}>Ok</Button>
            </Box>
        );
    }
    changeDate = (value) =>{
        this.state.usuario.dataNascimento = value;
        this.setState({modificado: true});
    }
    change = ({target}) =>{
        this.state.usuario[target.name] = target.value;
        this.setState({modificado: true});
    }
    atualizarUsuario=()=>{
        this.setState({loading: true});
        UsuarioHelper.atualizarUsuario(this.state.usuario)
        .then(usuario=>{
            this.setState({loading: false, modificado: false, usuario});
        })
        .catch(err=>{
            this.setState({loading: false});
            this.setErro(err.descricao);
        })
    }
    renderRead() {
        return (
            <Box className="DefaultPages_ROOT">
                <img alt="Foto de Perfil" style={style.img} src={this.state.usuario.fotoPerfil||logo}/>
                <Typography>
                    <span style={style.bold}>NOME: </span> {this.state.usuario.nome} 
                </Typography>
                <Typography style={style.bold}>SOBRE: </Typography>
                <Typography>
                    {this.state.usuario.nome} 
                </Typography>
            </Box>
        )
    }
    renderWrite() {
        return (
            <Box className="DefaultPages_ROOT">
                <img alt="Foto de Perfil" style={style.img} src={this.state.usuario.fotoPerfil||logo}/>
                <MaskedTextField
                    onChange={this.change}
                    label="E-mail" variant="outlined"
                    inputMode="email"
                    className="DefaultPages_INPUTS"
                    value={this.state.usuario.email} name="email"
                    disabled={true}
                />
                <MaskedTextField
                    onChange={this.change}
                    label="Nome" variant="outlined"
                    className="DefaultPages_INPUTS"
                    value={this.state.usuario.nome} name="nome"
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    onChange={this.change}
                    label="CPF" variant="outlined"
                    className="DefaultPages_INPUTS"
                    value={this.state.usuario.cpf} name="cpf"
                    mask="000.000.000.00"
                    disabled={this.state.loading}
                />
                <DatePicker
                    variant="dialog"
                    onChange={this.changeDate}
                    disableFuture
                    fullWidth
                    name="dataNascimento"
                    label="Data de Nascimento"
                    inputVariant="outlined"
                    value={this.state.usuario.dataNascimento}
                    disabled={this.state.loading}
                />
                <MaskedTextField
                    onChange={this.change}
                    label="Sobre mim (Opcional)" variant="outlined"
                    className="DefaultPages_INPUTS"
                    value={this.state.usuario.sobre} name="sobre"
                    multiline
                    disabled={this.state.loading}
                />
                <VisualizarLog log={this.state.usuario.ultimoLog} flex="1"/>
                <Button variant="contained" color="primary" onClick={this.atualizarUsuario} disabled={this.state.loading||!this.state.modificado}>Salvar</Button>
                {
                    this.props.useCurrentUser ?
                    (
                    <Button color="secondary" variant="outlined" onClick={UsuarioHelper.desconectar}>
                        SAIR
                    </Button>
                    ):undefined
                }
            </Box>
        );
    }
}
const style = {
    img: {
        alignSelf: "center",
        height: "200px",
        maxWidth: "auto",
        borderRadius: "10px",
        marginBottom: "10px"
    },
    bold: {
        fontWeight: "bold"
    }
}