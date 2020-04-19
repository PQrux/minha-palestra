import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  AuthenticationCriarConta,
  AuthenticationLogin,
  AuthenticationSobreVoce,
  AuthenticationSelfie,
  AuthenticationInformacoesLegais,
  AuthenticationEsqueciSenha,
} from "../views";
import { multiStorager } from '../utils';
import { Button, Box } from '@material-ui/core';
import { UsuarioHelper } from '../services';
export default class Authentication extends Component {
  state = {
    conectado: false,
  }
  componentDidMount(){
    multiStorager.DataStorager.addListener("usuario", "authentication_page", (usuario)=>{
      this.setState({conectado: usuario ? true : false});
    });
  }
  componentWillUnmount(){
    multiStorager.DataStorager.deleteListener("usuario","authentication_page");
  }
  sair = () => {
    UsuarioHelper.desconectar();
    this.props.history.push("");
  }
  render() {
    if(this.state.conectado) return (
      <Box flex="1" display="flex" flexDirection="column">
        <BrowserRouter>
          <Switch>
            <Route path="/cadastroselfie" exact component={AuthenticationSelfie}/>
            <Route path="/cadastroinformacoeslegais" exact component={AuthenticationInformacoesLegais}/>
            <Route path="/cadastrosobrevoce" exact component={AuthenticationSobreVoce}/>
            <Route path="*" component={AuthenticationSobreVoce}/>
          </Switch>
        </BrowserRouter>
        <Button style={{marginTop: 10}} variant="text" color="primary" onClick={this.sair}>
          Sair
        </Button>
      </Box>
    )
    else return (
      <BrowserRouter>
        <Switch>
          <Route path="/criarconta" exact component={AuthenticationCriarConta}/>
          <Route path="/esqueciminhasenha" exact component={AuthenticationEsqueciSenha}/>
          <Route path="/login" component={AuthenticationLogin}/>
          <Route path="/" exact component={AuthenticationLogin}/>
          <Route path="*" component={AuthenticationLogin}/>
        </Switch>
      </BrowserRouter>
    )
  }
}
