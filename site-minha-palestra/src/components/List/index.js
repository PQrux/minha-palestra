import { Box, InputAdornment, MenuItem, Typography, Button } from '@material-ui/core';
import { FilterList, Search, Add } from "@material-ui/icons";
import React, { Component } from 'react';
import ListItem from "../ListItem";
import "./styles.css";
import { MaskedTextField } from '..';

/**
 * @typedef ListProps
 * @property {string} titulo Propriedade contida nos itens que representa o título de cada item da lista.
 * @property {string} tituloLabel Determina o rótulo do atributo usado como título.
 * @property {Array<{propriedade: string, label: string, orderbyLabel: string, transform: function}>} descriptors Descritores dos itens da lista.
 * @property {Array} items Itens da lista.
 * @property {string} imagem Propriedade da imagem.
 * @property {function(Object)} onItemSelected Evento disparado quando um objeto é selecionado.
 * @property {any} selected Objeto da lista selecionado.
 * @property {string} defaultOrderBy Define um atributo padrão para a ordenação da lista.
 */
/**
 * @extends {Component<import("@material-ui/core").BoxProps|ListProps>}
 */
export default class List extends Component {
    state = {
        filter: "",
        sortBy: "",
        selected: null,
        filterFocus: false,
        orderbyFocus: false,
        orderby: this.props.defaultOrderBy||this.props.titulo,
    }
    renderTools = () => {
        return (
            <Box display="flex" flexDirection="column" padding="10px" paddingTop="20px">
                <Box display="flex">
                    <MaskedTextField 
                        variant="outlined" 
                        fullWidth
                        label={"Pesquisar "+this.props.tituloLista}
                        onChange={this.change} 
                        value={this.state.filter} 
                        onFocus={this.changeFocus}
                        onBlur={this.changeBlur}
                        name="filter"
                    />
                    {
                        this.props.add ?
                        <Button onClick={this.addClick} style={{marginLeft: "10px"}} color="primary" variant="contained">
                            <Add/>
                        </Button>: undefined
                    }
                </Box>
                <MaskedTextField
                    select
                    label="Ordenar por"
                    variant="outlined"
                    name="orderby"
                    value={this.state.orderby}
                    onChange={this.change}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterList/>
                            </InputAdornment>
                        )
                    }}
                    style={{marginTop: 10}}
                >
                    <MenuItem value={this.props.titulo}>
                        {this.props.tituloLabel||"Título"}
                    </MenuItem>
                    { this.props.descriptors.map(({propriedade, label, orderbyLabel})=>(
                        <MenuItem value={propriedade} key={propriedade}>
                            {orderbyLabel ? orderbyLabel : label}
                        </MenuItem>
                    ))}
                </MaskedTextField>
            </Box>
        )
    }
    renderToolsMini = () => {
        return (
            <Box display="flex" flexDirection="row" padding="10px" paddingTop="20px">
                <MaskedTextField 
                    variant="outlined" 
                    fullWidth
                    label={"Pesquisar "+this.props.tituloLista} 
                    onChange={this.change} 
                    value={this.state.filter} 
                    onFocus={this.changeFocus}
                    onBlur={this.changeBlur}
                    name="filter"
                />
                {
                    this.props.add ?
                    <Button onClick={this.addClick} style={{marginLeft: "10px"}} color="primary" variant="contained">
                        <Add/>
                    </Button>: undefined
                }
            </Box>
        )
    }
    render() {
        return (
            <Box 
                {...this.props} 
                className={["custom_list", this.props.className||""].join(" ")}
            >
                {this.props.mini ? this.renderToolsMini() : this.renderTools()}
                {this.renderItems()}
            </Box>
        );
    }
    addClick = () => {
        if(this.props.add) this.props.add.onClick();
        console.log(this.props.changeToRight);
        if(this.props.changeToRight) this.props.changeToRight();
    }
    change=({target})=>{
        this.setState({[target.name]: target.value});
    }
    changeFocus=({target})=>{
        let name = target.name+"Focus";
        this.setState({[name]: true});
    }
    changeBlur=({target})=>{
        let name = target.name+"Focus";
        this.setState({[name]: false});
    }
    changeSelected = (selected) => {
        this.setState({selected});
        if(this.props.changeToRight) this.props.changeToRight();
        if(this.props.onItemSelected) this.props.onItemSelected(selected);
    }
    renderItems = () => {
        if(this.props.items && this.props.items.length > 0){
            let { items, descriptors } = this.props;
            let { filter, orderby } = this.state;
            if(filter){
                filter = new RegExp(filter, "i");
                items = items.filter(item=>(
                    String(item[this.props.titulo]).match(filter) || 
                    (
                        descriptors && descriptors.find(({propriedade})=>(
                            String(item[propriedade]).match(filter)
                        ))
                    )
                ));
            }
            items = items.sort((a,b)=>( a[orderby] > b[orderby] ? 1 : a[orderby] < b[orderby] ? -1 : 0 ));
            if(items.length > 0)
            return (
                items.map((item, i)=>(
                    <ListItem 
                        key={i}
                        item={item}
                        onSelected={this.changeSelected}
                        img={item[this.props.imagem]}
                        titulo={item[this.props.titulo]} 
                        selected={this.props.selected ? item === this.props.selected : item === this.state.selected}
                        descriptors={descriptors.map(desc=>({titulo: desc.label, texto: desc.transform ? desc.transform(item[desc.propriedade]) : item[desc.propriedade]}))}
                    />
                ))
            );
        }
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Search fontSize="large"></Search>
                <Typography color="textPrimary">Nenhum resultado localizado.</Typography>
            </Box>
        );
    }
}
