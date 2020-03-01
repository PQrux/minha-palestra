import React, { Component } from 'react';
import { ResponsiveDivider } from "../../components";
import { Box, Tabs, Tab, Button } from '@material-ui/core';
import { AccountCircle, History, LiveTv } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { Perfil } from '../../partialviews';
export default class Home extends Component {
  constructor(props){
    super(props);
    this.options = [
      { label: "Palestras Disponíveis", icon: <LiveTv/>, OptionComponent: Slide2, OptionComponentProps: {}},
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
          
          index={this.state.option}
          onChangeIndex={(option)=>{this.setState({option})}}
        >
          {this.options.map(({OptionComponent, OptionComponentProps}, index)=>{
            return this.state.option === index ? <OptionComponent {...OptionComponentProps} /> : <div></div>
          }
          )}
        </SwipeableViews>
      </Box>
    );
  }
}
const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff',
  },
  slide1: {
    background: '#FEA900',
  },
  slide2: {
    background: '#B3DC4A',
  },
  slide3: {
    background: '#6AC0FF',
  },
};
const Usuarios = () => (
  <ResponsiveDivider>
    <Button>Teste1</Button>
    <Button>Teste2</Button>
  </ResponsiveDivider>
)
const Slide2 = () => (
  <div style={Object.assign({}, styles.slide, styles.slide2)}>
    slide n°2
  </div>
)