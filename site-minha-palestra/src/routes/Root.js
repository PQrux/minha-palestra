import React, { Component } from 'react';
import { multiStorager } from '../utils';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Splash, Login } from "../views";
export default class Root extends Component {
    constructor(props){
        super(props);
        this.state = {
          estado: "desconectado",
          usuario: undefined,
        }
        this.rotas = [];
    }
    componentDidMount(){
        multiStorager.DataStorager.addListener("usuario",(usuario)=>{
          if(usuario){
            this.setState({estado: "conectado", usuario: usuario});
          }
          else{
            this.setState({estado: "desconectado", usuario: undefined});
          }
        });
    }
    render() {
        if(this.state.estado === "conectado"){
            return (
              <BrowserRouter>
                <div className="container-root">
                  <Switch>
                    {this.rotas.map(rota=>(rota))}
                  </Switch>
                </div>
              </BrowserRouter>
            );
        }
        else if(this.state.estado === "desconectado"){
            return(
              <BrowserRouter>
                <Switch>
                  <Route path="*" component={Login}/>
                </Switch>
              </BrowserRouter>
            );
        }
          else if(this.state.estado === "carregando"){
            return (
              <Splash/>
            );
        }
    }
}
