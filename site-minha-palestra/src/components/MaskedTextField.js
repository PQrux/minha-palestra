import React, { Component } from 'react';
import { TextField } from "@material-ui/core";

/**
 * @extends {Component<import("@material-ui/core").TextFieldProps|{mask: string}>}
 */
export default class MaskedTextField extends Component {
    isLetter(c){
        return c.toLowerCase() !== c.toUpperCase();
    }
    /**
     * 
     * @param {Event} event 
     */
    checkText = (event) => {
        let value = event.target.value;
        let oldValue = "";
        if(this.props.mask){
            let mask = this.props.mask;
            if(this.props.value !== undefined){
                oldValue = this.props.value;
            }
            else{
                if(!this.value) this.value = "";
                oldValue = this.value;
            }
            if(value.length > mask.length){
                value = oldValue;
            }
            else{
                for(let i=0;i<value.length;i++){
                    if(this.props.mask[i] === "0"){
                        if(isNaN(parseInt(value[i]))){
                            value = oldValue;
                            break;
                        }
                    }
                    else if(this.props.mask[i] === "a"){
                        if(!this.isLetter(value[i])){
                            value = oldValue;
                            break;
                        }
                    }
                    else if(this.props.mask[i] !== "*"){
                        if(this.props.mask[i] !== value[i] && this.props.mask[i] === oldValue[i]){
                            value = oldValue;
                        }
                        else if(this.props.mask[i] !== value[i]){
                            let antes = value.substring(0,i);
                            let depois = value.substring(i,value.length);
                            value = antes+this.props.mask[i]+depois;
                        }
                    }
                }
            }
            event.target.value = value;
        }
        this.value = value;
        if(this.props.onChange) this.props.onChange(event);
    }
    render() {
        return (
            <TextField {...this.props} onChange={this.checkText}>
                {this.props.children}
            </TextField>
        );
    }
}
