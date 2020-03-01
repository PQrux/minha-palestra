import React, { Component } from 'react';
import { Box, Typography, Button } from "@material-ui/core";
/**
 * @typedef ListItemProps
 * @property {string} titulo Título do ListItem.
 * @property {Array<{titulo: string, texto: string}>} descriptors Itens do ListItem.
 * @property {Object} item Referência ao item.
 * @property {function(Object)} onSelected Evento disparado quando o item é selecionado.
 * @property {boolean} selected Define se o item está selecionado.
 */
/**
 * @extends {Component<ListItemProps>}
 */
export default class ListItem extends Component {
    itemSelected = () => {
        if(this.props.onSelected) this.props.onSelected(this.props.item);
    }
    render() {
        return (
        <Button 
            variant="text" 
            style={style.button} 
            {...this.props} 
            onClick={this.itemSelected}
            color={this.props.selected ? "primary" : "default"}
        >
            {this.props.img ? (
                <img src={this.props.img} onerror="this.style.display='none'" style={style.img}></img>
            ) : undefined}
            <Box>
                <Typography variant="h6">{this.props.titulo||"TITULO"}</Typography>
                {this.props.descriptors ? this.props.descriptors.map(({titulo, texto}, i)=>(
                    <Typography key={i} color="textSecondary">
                        {titulo} {texto}
                    </Typography>
                )) : undefined}
            </Box>
        </Button>
        );
    }
}
const style = {
    img: {
        width: "70px",
        borderRadius: "5px",
        marginRight: "5px"
    },
    button: {
        display: "flex",
        textTransform: "none",
        justifyContent: 'flex-start',
        borderBottom: "1px #e3e3e3 solid", 
        padding: "10px",
        borderRadius: "0px"
    }
}