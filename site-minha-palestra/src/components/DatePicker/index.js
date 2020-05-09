import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
    KeyboardTimePicker,
} from '@material-ui/pickers';
/**
 * @typedef DatePickerProps
 * @property {"date"|"datetime"|"time"} tipo Define o tipo de picker.
 */
/**
 * @extends {Component<DatePickerProps|import("@material-ui/pickers").KeyboardDatePickerProps|import("@material-ui/pickers").KeyboardTimePickerProps|import("@material-ui/pickers").KeyboardDateTimePickerProps>}
 */
export default class DatePicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataAtual: null,
    }
    this.verificarPropValue();
  }
  verificarPropValue = () => {
    if(this.props.value){
      let dt = new Date(this.props.value);
      if(dt.getTime()){
        this.state.dataAtual = dt;
        return;
      }
    }
    this.state.dataAtual = null;
  }
  componentDidUpdate(prevProps){
    if(!this._mudou_por_aqui && prevProps.value !== this.props.value){
      this.verificarPropValue();
      this.setState({});
    }
    this._mudou_por_aqui = false;
  }
  change = (date) => {
    this._mudou_por_aqui = true;
    this.state.dataAtual = date === null ? null : new Date(date);
    if(this.props.onChange) this.props.onChange(this.state.dataAtual);
    this.setState({});
  }
  verificarAoSair = (dontupdatestate) => {
    if(
      !this.state.dataAtual||
      !this.state.dataAtual.getTime()||
      (
        (this.props.maxDate && this.props.maxDate < this.state.dataAtual)||
        (this.props.minDate && this.props.minDate > this.state.dataAtual)
      )||
      (this.props.disableFuture && this.state.dataAtual > new Date())||
      (this.props.disablePast && this.state.dataAtual < new Date())
    ){
      if(this.props.onChange) this.props.onChange(null);
      if(!dontupdatestate) this.setState({dataAtual: null});
    }
  }
  componentWillUnmount(){
    this.verificarAoSair();
  }
  componentWillReceiveProps(next){
    if(next.value && next.value !== this.state.dataAtual){
      let date = new Date(next.value);
      if(date.getTime()) this.state.dataAtual = date;
    }
  }
  render() {
    let defaultInvalidText = this.props.tipo === "time" ? "Horário inválido!" : this.props.tipo === "datetime" ? "Data ou horário inválido!" : "Data inválida!";
    let props = Object.assign({}, this.props, {
      value: this.state.dataAtual,
      invalidDateMessage: this.props.invalidDateMessage||defaultInvalidText,
      maxDateMessage: this.props.maxDateMessage||defaultInvalidText,
      minDateMessage: this.props.minDateMessage||defaultInvalidText,
      cancelLabel: this.props.cancelLabel||"CANCELAR",
      format: this.props.format ? this.props.format : this.props.tipo === "time" ? "HH:mm" : this.props.tipo === "datetime" ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy",
      onChange: this.change,
      onBlur: ()=>{this.verificarAoSair()},
      ampm: this.props.ampm ? true : false,
    });
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
          {
            this.props.tipo === "time" ?
            <KeyboardTimePicker {...props}/> :
            this.props.tipo === "datetime" ?
            <KeyboardDateTimePicker {...props}/> :
            <KeyboardDatePicker {...props}/>
          }
        </MuiPickersUtilsProvider>
    );
  }
}
