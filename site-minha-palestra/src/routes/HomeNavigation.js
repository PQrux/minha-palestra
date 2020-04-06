import { Box } from '@material-ui/core';
import { History, Place, Settings, Event } from '@material-ui/icons';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Navigation, Carregamento } from '../components';
import { DialogHelper, UsuarioHelper } from '../services';
import { AuthenticationFim, EspacosDeApresentacao, MenuConfiguracoes, Usuarios } from "../views";
import { VisualizarEvento } from '../partialviews';
export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      options: [],
    };
  }
  componentDidMount(){
    let espacos = { path: "/espacos", label: "Espaços", icon: <Place/>, OptionComponent: EspacosDeApresentacao},
    usuarios = { path: "/usuarios", label: "Usuários", icon : <History/>, OptionComponent: Usuarios},
    eventos = {path: "/eventos", label: "Eventos", icon: <Event/>, OptionComponent: VisualizarEvento},
    ajustes = { path: "/ajustes", label: "Ajustes", icon: <Settings/>, OptionComponent: MenuConfiguracoes };
    UsuarioHelper.getUsuarioAtual().then((usuario)=>{
      switch(usuario.grupo){
        case "ADMINISTRADOR": 
          this.state.options.push(eventos);
          this.state.options.push(espacos);
          this.state.options.push(usuarios);
        case "PALESTRANTE":
        case "USUARIO":
        default:
          this.state.options.push(ajustes);
      }
      this.setState({options: this.state.options});
    })
    .catch(err=>{
      DialogHelper.showError(err);
    })
  }

  render() {
    let Default = this.state.options[0];
    if(this.state.options.length <= 0)
    return (
      <Carregamento preencher/>
    )
    else
    return (
      <Box className="root_page">
        <BrowserRouter>
          <Box style={{overflowX: "hidden", flex: 1, display: "flex", flexDirection: "column"}}>
            <Box style={{height: "100%", flexDirection: "row", display:"flex"}}>
              <Box style={{width: "100%", flexShrink: 0, overflow: "auto"}}>
                <Switch>
                  {this.state.options.map(({OptionComponent, path, OptionComponentProps})=>(
                  <Route 
                    path={path} 
                    key={path}
                    render={(props)=>(<OptionComponent {...Object.assign({}, props, OptionComponentProps)}/>)}/>
                  ))}
                  <Route
                    path="/cadastroconcluido"
                    exact
                    component={AuthenticationFim}
                  />
                  <Route
                    path="*" 
                    render={(props)=>(<Default.OptionComponent {...Object.assign({}, props, Default.OptionComponentProps)}/>)}
                  />
                </Switch>
              </Box>
            </Box>
          </Box>
          <Navigation options={this.state.options} default={Default}/>
        </BrowserRouter>
      </Box>
    );
  }
}
