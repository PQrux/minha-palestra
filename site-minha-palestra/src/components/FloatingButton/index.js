import React, { Component } from 'react';
import { Box, Button } from '@material-ui/core';

export default class FloatingButton extends Component {
  render() {
    return (
        <Box marginBottom="30px !important" width="100%" display="flex" flexDirection="column">
            <Button 
                {...this.props} 
                style={
                    Object.assign({position: "fixed", bottom: "10px", display: this.props.visible === false ? "none" : "flex", alignSelf: "center"}, 
                    this.props.style||{})
                }
            >
                {this.props.children}
            </Button>
        </Box>
    );
  }
}
