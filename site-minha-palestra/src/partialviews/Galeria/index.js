import React from 'react';
import { EasyComponent } from '../../components';
import { Box, Button, Typography, IconButton, ThemeProvider } from '@material-ui/core';
import { Add, Delete, PhotoCamera } from '@material-ui/icons';
import { ModalHelper, DialogHelper, FileHelper } from '../../services';
import { FirestoreObject, Permissao, Espaco, Palestra, Usuario, Evento } from "models-minha-palestra";
import { Permissoes, Themes } from "../../constants";
const noProfile = require("../../assets/images/no-profile.png");

export default class Galeria extends EasyComponent {
    constructor(props){
        super(props, new Permissao({}));
        this.state = {
            imgs: [],
        }
    }
    addImagem = () => {
        FileHelper.getFiles(true, "image/*", true).then(files=>{
            if(files.length > 0){
                FileHelper.saveFiles(DialogHelper.showFileSenderProgress, files, this.props.entidade, this.props.entidadeProp, !this.props.isNotArray)
                .then((entidade)=>{
                    if(this.props.refreshParent) this.props.refreshParent(entidade);
                    if(this.props.isNotArray) this.setState({imgs: [this.props.entidade[this.props.entidadeProp]]});
                    else this.setState({imgs: this.props.entidade[this.props.entidadeProp]});
                    DialogHelper.closeDialog();
                })
                .catch(err=>{
                    DialogHelper.showError(err);
                })
            }
        })
        .catch(err=>{
            DialogHelper.showError(err);
        })
    }
    removeImagem = (index) => {
        DialogHelper.showConfirmationBox(()=>{
            DialogHelper.closeDialog();
            this.state.imgs.splice(index, 1);
            if(this.props.refreshParent) this.props.refreshParent(this.props.entidade);
            this.setState({});
        }, "Confirmação", "Deseja mesmo excluir essa foto?");
    }
    carregarEntidade(){
        let { entidade, entidadeProp } = this.props;
        if((entidade instanceof FirestoreObject) && entidadeProp){
            if(entidade.path === this.usuario.path){
                this.disablePermissao = true;
            }
            else{
                this.disablePermissao = false;
                if((entidade instanceof Espaco)) this.permissor = Permissoes.espaco;
                else if((entidade instanceof Palestra)) this.permissor = Permissoes.palestra;
                else if((entidade instanceof Evento)) this.permissor = Permissoes.evento;
                else if((entidade instanceof Usuario)) this.permissor = Permissoes.perfil;
            }
            if(this.props.isNotArray){
                this.state.imgs = [entidade[entidadeProp]||noProfile];
            }
            else{
                if(!Array.isArray(entidade[entidadeProp])){
                    entidade[entidadeProp] = [];
                }
                this.state.imgs = entidade[entidadeProp];
            }
        }
        else{
            this.setNotFound(true);
        }
        this.setCarregando(false);
    }
    renderWrite() {
        if(this.props.isNotArray) return this.renderSolo(true);
        else return this.renderList(true);
    }
    renderRead() {
        if(this.props.isNotArray) return this.renderSolo(false);
        else return this.renderList(false);
    }
    setSelected = ({target}) =>{
        ModalHelper.setState({selected: target.name});
        ModalHelper.open(this.renderModal(), true);
    }
    renderModal = () => {
        let state = ModalHelper.getState();
        if(!state) state = {};
        return (
            <Box flex="1" padding="20px" display="flex" flexDirection="column">
                <Box style={Object.assign({backgroundImage: `url(${this.state.imgs[state.selected]})`}, styles.bigimg)}>
                </Box>
                {this.props.isNotArray ? undefined : this.renderList(false)}
            </Box>
        )
    }
    renderSolo(withAdd){
        return (
            <Box style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                <Button 
                    {...buttonopts}
                    name={0}
                    onClick={this.setSelected}
                    style={Object.assign({backgroundImage: `url(${this.state.imgs[0]})`, backgroundColor: "white"}, styles.button, {width: "200px", height: "200px"})} 
                />
                {
                    withAdd ?
                    <Button variant="outlined" color="primary" onClick={this.addImagem} disabled={!this.props.entidade||!this.props.entidade.path}>
                        <PhotoCamera/>
                    </Button>:undefined
                }
            </Box>
        )
    }
    renderList(withAdd){
        return (
            <Box style={{display: "flex", overflowX: "auto", width: "100%"}}>
                { withAdd ? 
                    <Button {...buttonopts} style={styles.button} onClick={this.addImagem} disabled={!this.props.entidade||!this.props.entidade.path}>
                        <Add></Add>
                        <Typography style={{wordBreak: "normal"}}>ADICIONAR FOTO</Typography>
                    </Button> : undefined
                }
                {this.state.imgs.map((img,i)=>(
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Button 
                            {...buttonopts} 
                            onClick={this.setSelected}
                            name={i}
                            style={Object.assign({backgroundImage: `url(${img})`, backgroundColor: "white"}, styles.button)} 
                            key={i}
                        />
                        {
                            withAdd ?
                            <ThemeProvider theme={Themes.info}>
                                <IconButton color="secondary" onClick={()=>this.removeImagem(i)}>
                                    <Delete/>
                                </IconButton>
                            </ThemeProvider>:undefined
                        }
                    </Box>
                ))}
            </Box>
        )
    }
}
const styles = {
    button: {
        display: "block",
        minWidth: "120px",
        minHeight:"120px",
        width: "120px",
        height:"120px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        marginRight: "5px",
        marginBottom: "3px",
    },
    bigimg: {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        marginBottom: "10px",
        flex: 1,
    }
}
const buttonopts = {
    color:"primary",
    variant: "outlined"
}
