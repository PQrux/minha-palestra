import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptBRLocale from 'date-fns/locale/pt-BR';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
/**
 * @extends {Component<import("@material-ui/pickers").KeyboardDatePickerProps>}
 */
export default class DatePicker extends Component {
  change = (date) => {
    if(this.props.onChange) this.props.onChange(new Date(date));
  }
  render() {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
            <KeyboardDatePicker
                {...this.props}
                invalidDateMessage={this.props.invalidDateMessage||"Data inválida!"}
                format={this.props.format||"dd/MM/yyyy"}
                onChange={this.change}
            />
        </MuiPickersUtilsProvider>
    );
  }
}
