import { Box, Button, Typography, ListItem } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { Usuario } from "models-minha-palestra";
import React from 'react';
import { DatePicker, EasyComponent, MaskedTextField, ResponsiveDividerBackButton, FloatingBox } from '../../components';
import { UsuarioHelper } from '../../services';
import VisualizarLog from '../VisualizarLog';
import { Arrayficar } from '../../utils';
import { Permissoes } from "../../constants";
import Galeria from '../Galeria';
const noProfile = require("../../assets/images/no-profile.png");

export default class Perfil extends EasyComponent {
    constructor(props){
        super(props, 
            Permissoes.perfil,
            "Você não tem permissão para visualizar usuários.", "Nenhum usuário selecionado.",
            undefined
        );
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
            this.setState({usuario: this.usuario, modificado: false});
            this.setNotFound(false);
            this.setCarregando(false);
        }
        else if(typeof this.props.entidade === "string"){
            this.setNotFound(true);
        }
        else if(this.props.entidade instanceof Usuario){
            this.setState({usuario: this.props.entidade, modificado: false});
            this.setNotFound(false);
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
            if(this.props.refreshParent) this.props.refreshParent(usuario);
            this.setState({loading: false, modificado: false, usuario});
        })
        .catch(err=>{
            this.setState({loading: false});
            this.setErro(err.descricao);
        })
    }
    renderMinimal(){
        return(
            <Box>
                <Box display="flex" alignItems="center" flexDirection="row !important">
                    <img alt="Foto de Perfil" style={style.img_mini} src={this.state.usuario.fotoPerfil||noProfile}/>
                    <Box>
                        <Typography style={{textTransform: "uppercase"}}>
                            {this.state.usuario.nome}
                        </Typography>
                        <Typography>
                            {this.state.usuario.sobre}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        )
    }
    renderRead() {
        if(this.props.minimal)
        return(this.renderMinimal())
        return (
            <div className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT">
                    <Galeria entidade={this.state.usuario} entidadeProp="fotoPerfil" isNotArray/>
                    <Typography autoCapitalize>
                        {this.state.usuario.grupo}
                    </Typography>
                    <Typography>
                        <span style={style.bold}>NOME: </span> {this.state.usuario.nome} 
                    </Typography>
                    <Typography style={style.bold}>SOBRE: {this.state.usuario.sobre}</Typography>
                    <Typography>
                        {this.state.usuario.nome} 
                    </Typography>
                </Box>
            </div>
        )
    }
    renderWrite() {
        return (
            <Box className="DefaultPages_INSIDER">
                <Box className="DefaultPages_ROOT">
                    <Galeria entidade={this.state.usuario} entidadeProp="fotoPerfil" isNotArray/>
                    <MaskedTextField
                        onChange={this.change}
                        label="E-mail" variant="outlined"
                        inputMode="email"
                        className="DefaultPages_INPUTS"
                        value={this.state.usuario.email} name="email"
                        disabled={true}
                    />
                    {
                        this.usuario.grupo === "ADMINISTRADOR" ?
                        <MaskedTextField
                            onChange={this.change}
                            label="Grupo" variant="outlined"
                            className="DefaultPages_INPUTS"
                            value={this.state.usuario.grupo} name="grupo"
                            disabled={this.state.loading}
                            select
                        >
                            {Arrayficar(Usuario.GRUPOS()).map(grupo=>(
                                <ListItem key={grupo.value} value={grupo.value}>
                                    {grupo.value}
                                </ListItem>
                            ))}
                        </MaskedTextField>:undefined
                    }
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
                    <VisualizarLog log={this.state.usuario.ultimoLog} width="100%"/>
                    <FloatingBox>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={this.atualizarUsuario} 
                            disabled={this.state.loading||!this.state.modificado} 
                            style={{marginLeft: 10, display: this.state.modificado ? "block" : "none"}}                    
                        >
                            Salvar
                        </Button>
                    </FloatingBox>
                </Box>
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
        marginBottom: "10px",
        boxShadow:"grey 1px 1px 6px 1px"
    },
    img_mini: {
        alignSelf: "center",
        height: "50px",
        borderRadius: "10px",
        marginBottom: "10px",
        marginRight: "10px",
        boxShadow:"grey 1px 1px 6px 1px"
    },
    bold: {
        fontWeight: "bold"
    }
}