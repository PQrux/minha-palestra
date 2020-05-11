import React, { Component } from 'react';
import "./style.css";
import { Box } from '@material-ui/core';
import { withRouter } from "react-router-dom";

class ResponsiveDivider extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstOpened: true,
    }
    this.gencode = new Date().getTime().toString();
    if(props.changeToRightRef) props.changeToRightRef(this.changeToRight);
    if(props.changeToLeftRef) props.changeToLeftRef(this.changeToLeft);
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.noHistory) return true;
    let gencode = window.location.hash;
    console.log({gencode, thiss: this.gencode, test: gencode === this.gencode})
    if("#"+this.gencode === gencode){
      nextState.firstOpened = false;
    }
    else{
      nextState.firstOpened = true;
    }
    console.log({sold: nextState.firstOpened})
    return true;
  }
  changeToRight = () => {
    if(this.props.noHistory){
      this.setState({firstOpened: false});
    }
    else{
      this.gencode = new Date().getTime().toString();
      window.location.hash = this.gencode;
    }
  }
  changeToLeft = () => {
    if(this.props.noHistory){
      this.setState({firstOpened: true});
    }
    else{
      window.location.hash = "";
    }
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
          <Box className={["responsive_divider_child", this.state.firstOpened ? "responsive_divider_active" : "responsive_divider_inactive"]}>
            {children[0]}
          </Box>
          <Box className={["responsive_divider_child",(!this.state.firstOpened ? "responsive_divider_active" : "responsive_divider_inactive")," responsive_divider_right"]}>
            {children[1]}
          </Box>
      </Box>
    );
  }
}
export default ResponsiveDivider;