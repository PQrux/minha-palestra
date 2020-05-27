import { Box } from '@material-ui/core';
import { History, Place, Settings, Event, LiveTv, EventSeat } from '@material-ui/icons';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Navigation, Carregamento } from '../components';
import { DialogHelper, UsuarioHelper } from '../services';
import { EspacosDeApresentacao, Eventos, MenuConfiguracoes, Usuarios, Palestras, Administracao } from "../views";

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
    eventos = {path: "/eventos", label: "Eventos", icon: <Event/>, OptionComponent: Eventos},
    palestras = {path: "/palestras", label: "Palestras", icon: <LiveTv/>, OptionComponent: Palestras},
    ajustes = { path: "/ajustes", label: "Ajustes", icon: <Settings/>, OptionComponent: MenuConfiguracoes, OptionComponentProps: {adminOptions: [usuarios, espacos]}};
    this.menu = [palestras, eventos, ajustes];
    UsuarioHelper.getUsuarioAtual().then((usuario)=>{
      if(usuario.grupo === "ADMINISTRADOR"){
        this.state.options.push(palestras);
        this.state.options.push(eventos);
        this.state.options.push(espacos);
        this.state.options.push(usuarios);
      }
      else if(usuario.grupo === "PALESTRANTE"){
        this.state.options.push(palestras);
        this.state.options.push(eventos);
      }
      else{
        this.state.options.push(palestras);
        this.state.options.push(eventos);
      }
      this.state.options.push(ajustes);
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
                    path="*" 
                    render={(props)=>(<Default.OptionComponent {...Object.assign({}, props, Default.OptionComponentProps)}/>)}
                  />
                </Switch>
              </Box>
            </Box>
          </Box>
          <Navigation options={this.menu} default={Default}/>
        </BrowserRouter>
      </Box>
    );
  }
}
