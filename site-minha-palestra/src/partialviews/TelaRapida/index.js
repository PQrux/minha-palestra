import React, { Component } from 'react';
import { Box, Button, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, List, Typography } from "@material-ui/core";
export default class TelaRapida extends Component {
    state = {
        alunos:[
            {nome: "Miguel", veio: false},
            {nome: "Arthur", veio: false},
            {nome: "Heitor", veio: false},
            {nome: "Bernardo", veio: false},
            {nome: "Théo", veio: false},
            {nome: "Davi", veio: false},
            {nome: "Gabriel", veio: false},
            {nome: "Pedro", veio: false},
            {nome: "Samuel", veio: false},
            {nome: "Lorenzo", veio: false},
            {nome: "Benjamin", veio: false},
            {nome: "Matheus", veio: false},
            {nome: "Lucas", veio: false},
            {nome: "Benício", veio: false},
            {nome: "Gael", veio: false},
            {nome: "Joaquim", veio: false},
            {nome: "Nicolas", veio: false},
            {nome: "Henrique", veio: false},
            {nome: "Rafael", veio: false},
            {nome: "Isaac", veio: false},
            {nome: "Guilherme", veio: false},
            {nome: "Murilo", veio: false},
            {nome: "Lucca", veio: false},
            {nome: "Gustavo", veio: false},
            {nome: "João Miguel", veio: false},
            {nome: "Noah", veio: false},
            {nome: "Felipe", veio: false},
            {nome: "Anthony", veio: false},
            {nome: "Enzo", veio: false},
            {nome: "João Pedro", veio: false},
            {nome: "Pietro", veio: false},
            {nome: "Bryan", veio: false},
            {nome: "Daniel", veio: false},
            {nome: "Pedro Henrique", veio: false},
            {nome: "Enzo Gabriel", veio: false},
            {nome: "Leonardo", veio: false},
            {nome: "Vicente", veio: false},
            {nome: "Valentim", veio: false},
            {nome: "Eduardo", veio: false},
            {nome: "Antônio", veio: false},
            {nome: "Emanuel", veio: false},
            {nome: "Davi Lucca", veio: false},
            {nome: "Bento", veio: false},
            {nome: "João", veio: false},
            {nome: "João Lucas", veio: false},
            {nome: "Caleb", veio: false},
            {nome: "Levi", veio: false},
            {nome: "Vitor", veio: false},
            {nome: "Enrico", veio: false},
            {nome: "Cauã", veio: false},
            {nome: "Caio", veio: false},
            {nome: "Vinícius", veio: false},
            {nome: "Henry", veio: false},
            {nome: "João Gabriel", veio: false},
            {nome: "Augusto", veio: false},
            {nome: "Ravi", veio: false},
        ]
    }
    render() {
        return (
            <Box display="flex" flexDirection="column" height="100%">
                <Typography align="center" style={{fontSize: "1.6rem"}}>Realize a Chamada</Typography>
                <List style={{overflow: "auto", marginBottom: "10px", flex: 1}}>
                    {this.state.alunos.map((item,i)=>(
                        <ListItem key={i}>
                            <ListItemText>{item.nome}</ListItemText>
                            <ListItemSecondaryAction>
                                <Checkbox
                                    onChange={()=>{item.veio = !item.veio; this.setState({})}}
                                    checked={item.veio}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Button color="primary" variant="contained">CONCLUIR</Button>
            </Box>
        )
    }
}
