import React from 'react';
import { InputComponent } from '../input-component';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
//import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';

export class CustomDateInput extends InputComponent {
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
        <DatePicker {...this.props} />
      </LocalizationProvider>
    );
  }
}
