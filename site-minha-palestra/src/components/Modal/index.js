import React, { Component } from 'react';
import { Box, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default class Modal extends Component {
    state = {
        opened: false,
        content: undefined,
        withCloseButton: false,
        data: {},
    }
    componentDidMount(){
        window.modal.open = this.open;
        window.modal.close = this.close;
        window.modal.setState = this.setData; 
        window.modal.getState = this.getState; 
    }
    getState = () => {
        return this.state.data;
    }
    open = (content, withCloseButton) => {
        this.setState({content, withCloseButton, opened: true});
    }
    close = () => {
        this.setState({opened: false, content: undefined, data: {}});
    }
    setData = (data) => {
        Object.assign(this.state.data, data);
        this.setState({data: this.state.data});
    }
    render() {
        return (
            <Box 
                zIndex="999" 
                position="fixed"
                width="100%" 
                height="100%"
                overflow="auto" 
                bgcolor="rgba(0,0,0,0.9)" 
                top="0" 
                left="0" 
                display={this.state.opened ? "flex" : "none"}
                flexDirection="column"
            >
                {this.state.withCloseButton ?
                    <Button variant="text" style={{alignSelf: "flex-end"}} onClick={this.close}>
                        <Close style={{color: "white", fontSize: "3rem"}}/>
                    </Button>
                : undefined }
                {this.state.content}
            </Box>
        );
    }
}

window.modal = {
    open: () => {},
    close: () => {},
    setState: () => {},
    getState: () => {},
}