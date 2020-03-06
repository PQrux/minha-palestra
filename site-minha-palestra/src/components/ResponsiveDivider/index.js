import React, { Component } from 'react';
import "./style.css";
import { Box } from '@material-ui/core';
import { withRouter } from "react-router-dom";

class ResponsiveDivider extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstOpened: true,
      lastUpdate: "",
    }
    this.gencode = new Date().getTime().toString();
    if(props.changeToRightRef) props.changeToRightRef(this.changeToRight);
    if(props.changeToLeftRef) props.changeToLeftRef(this.changeToLeft);
  }
  shouldComponentUpdate(nextProps, nextState){
    let gencode = nextProps.history.location.pathname.split("/").pop();
    if(this.gencode === gencode && nextState.lastUpdate !== gencode){
      nextState.lastUpdate = gencode;
      nextState.firstOpened = false;
      return true;
    }
    else if(this.gencode !== gencode && nextState.firstOpened !== true){
      nextState.firstOpened = true;
      return true;
    }
    return true;
  }
  changeToRight = () => {
    this.gencode = new Date().getTime().toString();
    this.props.history.push(this.gencode);
  }
  changeToLeft = () => {
    this.props.history.goBack();
  }
  render() {
    const children = [];
    if(this.props.children.forEach)
    this.props.children.forEach(child=>{
      children.push(React.cloneElement(child, {changeToRight: this.changeToRight, changeToLeft: this.changeToLeft}));
    })
    else children.push(this.props.children);
    return (
      <Box className="responsive_divider_root" {...this.props}>
          <Box className={this.state.firstOpened ? "responsive_divider_active" : "responsive_divider_inactive"}>
            {children[0]}
          </Box>
          <Box className={!this.state.firstOpened ? "responsive_divider_active" : "responsive_divider_inactive"}>
            {children[1]}
          </Box>
      </Box>
    );
  }
}
export default withRouter(ResponsiveDivider);