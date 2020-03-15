import React, { Component } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import "./styles.css";
import { ArrowBack } from '@material-ui/icons';
export default class ResponsiveDividerBackButton extends Component {
    componentDidMount(){
        console.log(this.props);
    }
    render() {
        return (
            <Box display={this.props.changeToLeft ? "block" : "none"} alignSelf="flex-start">
                <Button className="responsive_divider_back_to_left_button" variant="text" color="primary" onClick={this.props.changeToLeft}>
                    <ArrowBack /> <Typography>Voltar</Typography>
                </Button>
            </Box>
        );
    }
}
