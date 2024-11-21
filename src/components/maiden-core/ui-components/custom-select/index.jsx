import React from 'react';
import { InputComponent } from '../input-component';
import { MenuItem, Select, FormControl, InputLabel } from '@material-ui/core';
import '../../../../../src/index.css'

export class CustomSelect extends InputComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      options,
      onChange,
      name,
      value,
      allowZeros,
      mode,
      mappingId,
      title,
      disabled,
      ...rest
    } = this.props;
    var additionalProps = {};
    if (mode == 'multiple') {
      additionalProps = { multiple: true };
    }
    return (
      <FormControl style={{ width: '100%' }} className='formControl' disabled={disabled}>
        <InputLabel>{title}</InputLabel>
        <Select
          {...rest}
          {...additionalProps}
          name={name}
          value={value}
          label={title}
          className={'select_' + name}
          placeholder="Select..."
          getPopupContainer={() => {
            return document.getElementsByClassName('ant-modal-body')[0];
            //.parentElement.parentElement.parentElement.parentElement.parentElement
          }}
          onChange={onChange}
          showSearch
          select
          allowZeros={allowZeros}
          filterOption={(input, option) => {
            if (!option.props.children) {
              return false;
            }
            return input
              ? option.props.children.toLowerCase().startsWith(input.toLowerCase())
              : true;
          }}
        >
          {options.map((option) => (
            <MenuItem
              style={{ zIndex: '999999999' }}
              title={option.DisplayValue}
              value={option[mappingId]}
              className='plusAddButtonModalPopUp_Dropdown'
            >
              {option.DisplayValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}
