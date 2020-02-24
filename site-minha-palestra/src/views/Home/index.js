import React, { Component } from 'react';
import { Navigator } from "../../components";
import { Box, Tabs, Tab } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
export default class Home extends Component {
  constructor(props){
    super(props);
    this.options = [
      { label: "Meu Perfil", icon: <AccountCircle/>, component: (
        <div style={Object.assign({}, styles.slide, styles.slide1)}>
          slide n°1
        </div>
      ) },
      { label: "Favoritos", component: (
        <div style={Object.assign({}, styles.slide, styles.slide2)}>
          slide n°2
        </div>
      )},
      { label: "Próximo", component: (
        <div style={Object.assign({}, styles.slide, styles.slide3)}>
          slide n°3
        </div>
      )},
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
          {this.options.map(({component})=>component)}
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