import React from 'react';
import { EasyComponent } from '../../components';
import { Box, Button, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { ModalHelper, DialogHelper } from '../../services';
import { Permissao } from "models-minha-palestra";
//const noImage = require("../../assets/images/no-image.png");
import { Permissoes } from "../../constants";
export default class Galeria extends EasyComponent {
    constructor(props){
        super(props, Permissoes.galeria);
        this.state = {
            imgs: [],
        }
    }
    addImagem = () => {
        
    }
    carregarEntidade(){
        this.setCarregando(false);
    }
    renderWrite() {
        return this.renderList(true);
    }
    renderRead() {
        return this.renderList(false);
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
                {this.renderList(false)}
            </Box>
        )
    }
    renderList(withAdd){
        return (
            <Box style={{display: "flex", overflowX: "auto", width: "100%"}}>
                { withAdd ? 
                    <Button {...buttonopts} style={styles.button} onClick={this.addImagem}>
                        <Add></Add>
                        <Typography color="primary">ADICIONAR FOTO</Typography>
                    </Button> : undefined
                }
                {this.state.imgs.map((img,i)=>(
                    <Button 
                        {...buttonopts} 
                        onClick={this.setSelected}
                        name={i}
                        style={Object.assign({backgroundImage: `url(${img})`}, styles.button)} 
                        key={i}
                    />
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
