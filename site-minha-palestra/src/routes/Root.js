import React, { Component } from 'react';
import { multiStorager } from '../utils';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Splash, Login, Home } from "../views";
import { UsuarioHelper } from '../services';
export default class Root extends Component {
    constructor(props){
      super(props);
      this.state = {
        estado: "carregando",
        usuario: undefined,
      }
      this.rotas = [
        {component: Home, path: "*"},
      ];
    }
    definirConectado(usuario){
      if(!usuario||!usuario.nome||!usuario.dataNascimento||!usuario.dataNascimento.getTime()||!usuario.cpf)
      return "desconectado";
      else return "conectado";
    }
    usuarioCallback = (usuario)=>{
      this.setState({estado: this.definirConectado(usuario), usuario: usuario});
    }
    componentDidMount(){
      UsuarioHelper.getUsuarioAtual().then(usuario=>{
        multiStorager.DataStorager.addListener("usuario", "root_page",this.usuarioCallback);
      })
      .catch(err=>{
        multiStorager.DataStorager.addListener("usuario", "root_page",this.usuarioCallback);
      })
    }
    componentWillUnmount(){
      multiStorager.DataStorager.deleteListener("usuario","root_page");
    }
    render() {
        if(this.state.estado === "conectado"){
            return (
              <BrowserRouter>
                  <Switch>
                    {this.rotas.map(rota=>(
                      <Route key={rota.path} path={rota.path} component={rota.component}/>
                    ))}
                  </Switch>
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
