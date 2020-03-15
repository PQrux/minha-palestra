import { Box, Tab, Tabs } from '@material-ui/core';
import { AccountCircle, History, LiveTv } from '@material-ui/icons';
import React, { Component } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Perfil } from '../../partialviews';
import PalestrasDisponiveis from "../PalestrasDisponiveis";
import Usuarios from "../Usuarios";
export default class Home extends Component {
  constructor(props){
    super(props);
    this.options = [
      { label: "Palestras Disponíveis", icon: <LiveTv/>, OptionComponent: PalestrasDisponiveis, OptionComponentProps: {}},
      { label: "Meu Perfil", icon: <AccountCircle/>, OptionComponent: Perfil, OptionComponentProps: {useCurrentUser: true, showNotFound: true} },

      { label: "Usuários", icon : <History/>, OptionComponent: Usuarios, OptionComponentProps: {}},
    ]
  }
  state = {
    option: 0,
  }
  render() {
    return (
      <Box className="root_page">
        <Box>
          <Tabs
            value={this.state.option}
            onChange={(event, option) => {
                this.setState({option});
            }}
            variant="scrollable"
            indicatorColor="primary"
            scrollButtons="on"
            textColor="primary"
            >
            {
              this.options.map(({label, icon}, index)=>(
                  <Tab label={label} value={index} icon={icon} />
              ))
            }
          </Tabs>
        </Box>
        <SwipeableViews
          style={{flex: 1, display: "flex", flexDirection: "column"}}
          index={this.state.option}
          onChangeIndex={(option)=>{this.setState({option})}}
          containerStyle={{height: "100%", display: "flex"}}
        >
          {this.options.map(({OptionComponent, OptionComponentProps}, index)=>{
            return this.state.option === index ? <OptionComponent {...OptionComponentProps} style={{flex: 1}}/> : <div></div>
          }
          )}
        </SwipeableViews>
      </Box>
    );
  }
}
