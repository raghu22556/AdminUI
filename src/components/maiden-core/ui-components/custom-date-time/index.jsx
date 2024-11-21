import React from 'react';
import { InputComponent } from '../input-component';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';

export class CustomDateTimeInput extends InputComponent {
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
        <DateTimePicker {...this.props} />
      </LocalizationProvider>
    );
  }
}
