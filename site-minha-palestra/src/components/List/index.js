import React, { Component } from 'react';
import ListItem from "../ListItem";
import { Box, Typography } from '@material-ui/core';
import "./styles.css";
import { Search } from "@material-ui/icons";
/**
 * @typedef ListProps
 * @property {string} titulo Propriedade contida nos itens que representa o título de cada item da lista.
 * @property {Array<{propriedade: string, label: string}>} descriptors Descritores dos itens da lista.
 * @property {Array} items Itens da lista.
 * @property {string} imagem Propriedade da imagem.
 * @property {function(Object)} onItemSelected Evento disparado quando um objeto é selecionado.
 * @property {any} selected Objeto da lista selecionado.
 */
/**
 * @extends {Component<import("@material-ui/core").BoxProps|ListProps>}
 */
export default class List extends Component {
    state = {
        filter: "",
        selected: null,
    }
    render() {
        return (
            <Box 
                {...this.props} 
                className={["custom_list", this.props.className||""].join(" ")}
            >
                {this.renderItems()}
            </Box>
        );
    }
    changeSelected = (selected) => {
        this.setState({selected});
        if(this.props.onItemSelected) this.props.onItemSelected(selected);
    }
    renderItems = () => {
        if(this.props.items && this.props.items.length > 0){
            let { items, descriptors } = this.props;
            let filter = this.state.filter;
            if(filter) 
            items = items.filter(item=>(
                String(item[this.props.titulo]).match(filter) || 
                (
                    descriptors && descriptors.find(({propriedade})=>(
                        String(item[propriedade]).match(filter)
                    ))
                )
            ));
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
                        descriptors={descriptors.map(desc=>({titulo: desc.label, texto: item[desc.propriedade]}))}
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
