import React, { Component } from 'react';
import { Box, Button } from '@material-ui/core';
import "./styles.css";
import { ArrowBack } from '@material-ui/icons';
export default class ResponsiveDividerBackButton extends Component {
    componentDidMount(){
        console.log(this.props);
    }
    render() {
        return (
            <Box display={this.props.changeToLeft ? "block" : "none"} alignSelf="flex-start" position="sticky" top="0" zIndex="20">
                <Button className="responsive_divider_back_to_left_button" variant="contained" color="primary" onClick={this.props.changeToLeft}>
                    <ArrowBack />
                </Button>
            </Box>
        );
    }
}
