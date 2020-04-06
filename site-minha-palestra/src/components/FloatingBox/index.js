import React, { Component } from 'react';
import { Box } from '@material-ui/core';

export default class FloatingBox extends Component {
    render() {
        return (
            <Box marginBottom="30px !important" width="100%" display="flex" flexDirection="column">
                <Box position="fixed" zIndex="9" bottom="70px" alignSelf="center" display="flex" flexDirection="row" style={this.props.style}>
                    {this.props.children}
                </Box>
            </Box>
        );
    }
}
