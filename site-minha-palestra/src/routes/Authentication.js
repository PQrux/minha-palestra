import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  AuthenticationCriarConta,
  AuthenticationLogin,
  AuthenticationSobreVoce,
  AuthenticationSelfie,
  PedidoParaSerPalestrante,
  AuthenticationInformacoesLegais,
  AuthenticationQuemE,
  AuthenticationEsqueciSenha,
} from "../views";
import { UsuarioHelper } from '../services';
import DeterminarTelaCadastroUsuario from '../utils/DeterminarTelaUsuario';
export default class Authentication extends Component {
  usuarioCallback = (usuario)=>{
    let tc = DeterminarTelaCadastroUsuario(usuario);
    if(tc && this.props.history && !this.unmounted) this.props.history.push(tc);
  }
  componentDidMount(){
    UsuarioHelper.getUsuarioAtual().then(this.usuarioCallback)
    .catch(err=>{});
  }
  componentWillUnmount(){
    this.unmounted = true;
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/esqueciminhasenha" exact component={AuthenticationEsqueciSenha}/>
          <Route path="/cadastroselfie" exact component={AuthenticationSelfie}/>
          <Route path="/cadastroinformacoeslegais" exact component={AuthenticationInformacoesLegais}/>
          <Route path="/cadastroqueme" exact component={AuthenticationQuemE}/>
          <Route path="/cadastroserpalestrante" exact component={PedidoParaSerPalestrante}/>
          <Route path="/cadastrosobrevoce" exact component={AuthenticationSobreVoce}/>
          <Route path="/criarconta" exact component={AuthenticationCriarConta}/>
          <Route path="/login" component={AuthenticationLogin}/>
          <Route path="/" exact component={AuthenticationLogin}/>
          <Route path="*" component={AuthenticationLogin}/>
        </Switch>
      </BrowserRouter>
    )
  }
}
