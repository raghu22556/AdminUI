/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Form, Col, Row, Button, Input, Collapse } from 'antd';
import { connect } from 'react-redux';
import API from '../../store/requests';
import Snackbar from '../Snackbar/Snackbar.jsx';
import DateFormat, { Util } from '../../utils/date';
import moment from 'moment';
import { isGuidSystem, isNewBackend } from '../../app-config';
import Guid from 'guid';
import { Modal } from 'antd';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { CircularProgress, Select } from '@material-ui/core';
import 'moment//locale/es';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import InfoIcon from '@material-ui/icons/Info';
import './simple-form.css';

import {
  InputComponent,
  CustomInput,
  CustomDateInput,
  CustomDateTimeInput,
  CustomSwitchInput,
  CustomTextAreaInput,
  TabPanel,
  CustomSelect,
  ImageUpload,
  VideoUpload,
  MultiInput,
  CustomReduxAutoComplete,
} from '../maiden-core/ui-components';

const { Panel } = Collapse;

const modal = Modal;
var buttonClickChild = '';
var datevalidationobj = {};

const { TextArea } = Input;
const { Option } = Select;
export const FieldTypes = {
  String: 'string',
  Amount: 'float',
  // Need to handle
  Text: 'text',
  Date: 'date',
  // Need to handle
  DateTime: 'datetime',
  // Need to handle
  Lookup: 'combo',
  Toggle: 'boolean',
  Number: 'int',
  TextArea: 'textarea',
  AutoFill: 'autofill',
  Password: 'password',
  ImageUpload: 'imageUpload',
  MultiImageUpload: 'multiImageUpload',
  MultiInput: 'multiInput',
  Url: 'url',
  Email: 'email',
  LatLong: 'latlong',
  Percentage: 'percentage',
  MacAddress: 'macAddress',
  Numeric: 'numeric',
  Float: 'float',
  Alphanumeric: 'alphanumeric',
  FileUpload: 'fileupload',
  RefMediaUpload: 'refmediaupload',
  AjaxSelect: 'ajaxSelect',
  SearchAjax: 'searchAjax',
  MinMax: 'minmax',
  Dragger: 'dragger',
  Button: 'button',
  VideoUpload: 'videoUpload',
};

const getThemeColor = () => {
  return '';
};

CustomSelect.defaultProps = {
  mappingId: 'LookupId',
};

/*
const CustomSelect = ({ options, onChange, name, value, allowZeros, mode }) => {
  //var a = options.find(item => item.LookupId == value);
  //if (typeof a == 'undefined') options.push({ LookupId: value, DisplayValue: '' });
  return (
    <CustomSelectLarge
      mode={mode}
      name={name}
      value={value}
      className={'select_' + name}
      placeholder="Select..."
      getPopupContainer={() => {
        return document.getElementsByClassName('ant-modal-body')[0];
        //.parentElement.parentElement.parentElement.parentElement.parentElement
      }}
      onChange={onChange}
      style={{ width: '100%' }}
      showSearch
      allowZeros={allowZeros}
      filterOption={(input, option) => {
        if (!option.props.children) {
          return false;
        }
        return input ? option.props.children.toLowerCase().startsWith(input.toLowerCase()) : true;
      }}
    >
      {options.map(option => (
        <Option style={{ zIndex: '999999999' }} value={option.LookupId}>
          {option.DisplayValue}
        </Option>
      ))}
    </CustomSelectLarge>
  );
};
*/
const ReturnComponent = ({
  item,
  data,
  name,
  fieldValue: value,
  onChange,
  activeRecordId,
  stringComboVal,
  params,
  translate,
  mode,
  disabled,
  recProps,
  recState,
}) => {
  if (item.type == FieldTypes.Number) {
    if (item.disabledOnEdit) {
      if (typeof recProps.activeRecordId == 'number') {
        disabled = true;
      }
    }

    return (
      <CustomInput
        type="text"
        name={name}
        value={value}
        maxLength={item.maxLength ? item.maxLength : 250}
        onChange={(event) => {
          let value = event.target.value;
          if (/^-?\d*[.,]?\d*$/.test(value)) {
            if (item.allowNegatives || value >= 0) {
              onChange(value);
            }
          }
        }}
        // label={item.title}
        disbled={disabled}
      />
    );
  } else if (item.type == FieldTypes.String) {
    return (
      <CustomInput
        name={name}
        value={value}
        onChange={onChange}
        // label={item.title}
        disbled={disabled}
      />
    );
  } else if (item.type == FieldTypes.Amount) {
    if (item.disabledOnEdit) {
      if (typeof recProps.activeRecordId == 'number') {
        disabled = true;
      }
    }

    return (
      <CustomInput
        name={name}
        disabled={disabled}
        maxLength={item.maxLength ? item.maxLength : 250}
        value={value != null ? value?.toString() : item.defaultValue}
        onChange={(event) => {
          let value = event.target.value;
          if (/^-?\d*[.,]?\d*$/.test(value)) onChange(value);
        }}
        // label={item.title}
        disbled={disabled}
      />
    );
  } else if (item.type == FieldTypes.Date) {
    return (
      <CustomDateInput
        name={name}
        value={value}
        format="DD-MM-YYYY"
        onChange={onChange}
        style={{ width: '100%' }}
        // label={item.title}
        disbled={disabled}
        getCalendarContainer={(trigger) => trigger.parentNode}
      />
    );
  } else if (item.type == FieldTypes.DateTime) {
    return (
      <CustomDateTimeInput
        showTime
        placeholder="Select Time"
        format="YYYY-MM-DD HH:mm:ss"
        name={name}
        onChange={onChange}
        style={{ width: '100%' }}
        value={value}
        disbled={disabled}
        disabledDate={(current) => {
          if (item.disablePastDate) {
            return current && current < item.disablePastDate;
          } else {
            return false;
          }
        }}
        getCalendarContainer={(trigger) => trigger.parentNode}
      />
    );
  } else if (item.type == FieldTypes.Toggle) {
    return (
      <CustomSwitchInput
        name={name}
        checked={value}
        onChange={onChange}
        // label={item.title}
        disbled={disabled}
      />
    );
  } else if (item.type == FieldTypes.TextArea || item.type == FieldTypes.Text) {
    let props = {};
    if (item.rowSpan)
      props = {
        autoSize: { minRows: item.rowSpan - 2, maxRows: item.rowSpan },
      };

    return (
      <CustomTextAreaInput
        rows={item.rowSpan || 1}
        // label={item.title}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
    );
  } else if (item.type == FieldTypes.AutoFill) {
    return (
      <CustomReduxAutoComplete
        name={name}
        value={value}
        onChange={onChange}
        activeModule={item.activeModule}
        comboType={item.comboType}
        activeRecordId={activeRecordId}
        params={params}
        allowZeros={item.allowZeros}
      />
    );
  } else if (item.type == FieldTypes.Lookup) {
    return (
      <CustomSelect
        name={name}
        value={item.mode == 'multiple' ? (value ? value : []) : value}
        onChange={onChange}
        options={data}
        allowZeros={item.allowZeros}
        mode={item.mode || 'default'}
        mappingId={item.mappingId}
        // title={item.title}
        disabled={disabled}
      />
    );
  } else if (item.type == FieldTypes.Password) {
    return (
      <CustomInput
        name={name}
        value={value}
        type="password"
        onChange={onChange}
        disbled={disabled}
      />
    );
  } else if (item.type == FieldTypes.ImageUpload) {
    return (
      <ImageUpload onChange={onChange} name={name} value={value} item={item} disbled={disabled} />
    );
  } else if (item.type == FieldTypes.VideoUpload) {
    return <VideoUpload onChange={onChange} name={name} value={value} item={item} />;
  } else if (item.type == FieldTypes.MultiInput) {
    return <MultiInput onChange={onChange} name={name} value={value} />;
  } else {
    return <CustomInput name={name} value={value} onChange={onChange} />;
  }
};

class SimpleForm extends PureComponent {
  constructor(props) {
    super(props);
    const { selectedRow, columns } = props;
    this.state = {
      applyLocalChange: false,
      snackBarVisible: false,
      hideField: [],
      notRequiredFields: {},
      columns: [],
      validForm: {},
      selectedTabs: 0,
      collapseViewShow: ['active'],
      isDisabledField: false,
    };
    this.defaultColSpan = 11;
    this.defaultMinHeight = 105;
    this.updateState({ selectedRow, columns });

    this.setState({}, this.afterDataLoad);
  }

  afterDataLoad = () => {
    if (this.props.config.afterRecordLoad) {
      this.props.config.afterRecordLoad({ formPanel: this });
    }
  };

  componentWillMount() {
    this.afterDataLoad();
  }

  isValidLookUp = (value) => {
    if (!isNaN(value)) {
      return value > 0;
    }
    if (isGuidSystem) {
      if (!value) {
        return false;
      }
      var guid = new Guid(value);
      return !guid.equals(Guid.EMPTY);
    } else {
      return value > 0;
    }
  };

  updateState = ({ selectedRow, columns }) => {
    if (selectedRow) {
      for (var col of columns) {
        var key = col.mappingDataIndex || col.dataIndex;
        var formKey = col.dataIndex;
        if (col.type == FieldTypes.Toggle) {
          this.state[formKey] =
            selectedRow[key] == 'Y' ||
            selectedRow[key] == 'true' ||
            selectedRow[key] == 'Active' ||
            selectedRow[key] == 1
              ? true
              : false;
        } else if (col.type == FieldTypes.Text || col.type == FieldTypes.String) {
          if (selectedRow[key] == null) {
            this.state[formKey] = '';
          } else {
            this.state[formKey] = selectedRow[key];
          }
        } else if (col.type == FieldTypes.Date) {
          if (selectedRow[key]) {
            this.state[formKey] = moment(DateFormat.parse(selectedRow[key]));
          } else {
            this.state[formKey] = null;
          }
        } else if (col.type == FieldTypes.DateTime) {
          if (selectedRow[key]) {
            this.state[formKey] = moment(DateFormat.parse(selectedRow[key]));
          } else {
            this.state[formKey] = null;
          }
        } else if (col.type == FieldTypes.MultiInput) {
          if (selectedRow[key]) {
            this.state[formKey] = selectedRow[key].split(',');
          } else {
            this.state[formKey] = [];
          }
        } else if (col.type === FieldTypes.AutoFill || col.type === FieldTypes.Lookup) {
          if (col.mode == 'multiple') {
            if (selectedRow[key]) {
              this.state[formKey] = selectedRow[key]
                .split(',')
                .map((item) => parseInt(item))
                .filter((item) => item);
            } else {
              this.state[formKey] = [];
            }
          } else if (
            this.isValidLookUp(selectedRow[key]) ||
            col.allowZeros ||
            (col.allowIdAsString && selectedRow[key] !== '')
          ) {
            this.state[formKey] = selectedRow[key];
          } else {
            this.state[formKey] = '';
          }
        } else {
          this.state[formKey] = selectedRow[key];
        }
      }
    }
  };

  // else if (col.type == FieldTypes.Lookup ) {
  //   debugger
  //   if (selectedRow[key] == null) {
  //     this.state[formKey] = '';
  //   } else {
  //     this.state[formKey] = selectedRow[key];
  //   }
  // }

  checkCollapseError(errors) {
    let { columns } = this.props;
    if (errors) {
      columns.forEach((fields) => {
        if (fields.isCollapse) {
          var sectionValid = true;
          fields.columns.forEach((columnsFiled) => {
            Object.keys(errors).forEach((ele) => {
              if (columnsFiled.title == ele) {
                if (errors[ele].errors.length !== 0) {
                  sectionValid = false;
                }
              }
            });
          });
          var setErrors = this.state.validForm;
          setErrors[fields.header] = sectionValid;
          this.setState({ validForm: setErrors });
        }
      });
    }
  }

  componentWillReceiveProps({ selectedRow, columns, activeRecordId, visible }) {
    if (
      selectedRow &&
      JSON.stringify(selectedRow) !== JSON.stringify(this.props.selectedRow) &&
      (!this.state.applyLocalChange || this.props.activeRecordId != activeRecordId)
    ) {
      this.updateState({ selectedRow, columns });
      this.setState({ activeRecordId }, this.afterDataLoad);
    }
    if (visible !== this.props.visible && !visible) {
      this.props.form.resetFields();
      for (var col of columns) {
        var formKey = col.dataIndex;
        this.onChange(formKey, null);
      }
      this.setState({});
      this.files = [];
      if (this.props.config.resetFormFields) this.props.config.resetFormFields();
    }
  }
  success = () => {
    const { t } = this.props;
    modal.destroyAll();
    modal.success({
      title: t('Record Saved Successfully') + '...',
      okButtonProps: {
        style: { backgroundColor: '#24b5ee', border: 'none', display: 'none' },
      },
    });
    setTimeout(() => {
      modal.destroyAll();
    }, 1000);
  };
  componentDidMount() {}

  onSave = (closeable, callBack) => {
    const { t } = this.props;
    this.props.form.validateFields({ validateOnly: false }).then(() => {
      this.setState({ loading: true });
      this.files = [];
      const {
        toggle,
        resetProps,
        config: { parentIdColumn },
        selectedRow,
        selectedRowParent,
        activeRecordId,
      } = this.props;
      var values = this.state;
      var json = {
        action: 'save',
        apiIdentifier: this.props.apiIdentifier,
      };
      var columns = this.props.columns;
      for (var col of columns) {
        var fieldId = col.dataIndex;
        if (col.type == FieldTypes.Toggle) {
          if (values[fieldId]) {
            json[fieldId] = true;
          } else {
            json[fieldId] = false;
          }
          continue;
        }

        if (activeRecordId == 'NEW_RECORD') {
          if (values[fieldId]) {
            if (col.type == FieldTypes.DateTime) {
              json[fieldId] = values[fieldId].format(Util.dateTimeParamFormat);
            } else if (col.type == FieldTypes.Date) {
              json[fieldId] = values[fieldId].format(Util.dateParamFormat);
            } else if (col.type == FieldTypes.MultiInput) {
              json[fieldId] = values[fieldId].toString();
            } else if (col.type == FieldTypes.ImageUpload) {
              json[fieldId] = values[fieldId];
              this.files.push(values[fieldId]);
            } else if (col.type == FieldTypes.Lookup && col.mode == 'multiple') {
              if (values[fieldId].length == 0) {
                // Not sending key value pair
              } else {
                json[fieldId] = values[fieldId];
              }
            } else {
              if (
                typeof values[fieldId] !== 'undefined' &&
                (values[fieldId] || values[fieldId] === 0)
              ) {
                json[fieldId] = values[fieldId];
              }
            }
          } else {
            // Not sending key value pair
          }
        } else {
          if (selectedRow[fieldId]) {
            // Value exists
            if (values[fieldId]) {
              if (col.type == FieldTypes.DateTime) {
                json[fieldId] = values[fieldId].format(Util.dateTimeParamFormat);
              } else if (col.type == FieldTypes.Date) {
                json[fieldId] = values[fieldId].format(Util.dateParamFormat);
              } else if (col.type == FieldTypes.MultiInput) {
                json[fieldId] = values[fieldId].toString();
              } else if (col.type == FieldTypes.ImageUpload) {
                json[fieldId] = values[fieldId];
                this.files.push(values[fieldId]);
              } else if (col.type == FieldTypes.Lookup && col.mode == 'multiple') {
                if (values[fieldId].length == 0) {
                  // exists in old record but modified to empty in current state
                  json[fieldId] = 'NULL';
                } else {
                  json[fieldId] = values[fieldId];
                }
              } else {
                if (
                  typeof values[fieldId] !== 'undefined' &&
                  (values[fieldId] || values[fieldId] === 0)
                ) {
                  json[fieldId] = values[fieldId];
                } else {
                  if (selectedRow[fieldId]) {
                    // exists in old record but modified to empty in current state
                    json[fieldId] = 'NULL';
                  }
                }
              }
            } else {
              // exists in old record but modified to empty in current state
              json[fieldId] = 'NULL';
            }
          } else {
            // Value not exists earlier
            if (values[fieldId]) {
              if (col.type == FieldTypes.DateTime) {
                json[fieldId] = values[fieldId].format(Util.dateTimeParamFormat);
              } else if (col.type == FieldTypes.Date) {
                json[fieldId] = values[fieldId].format(Util.dateParamFormat);
              } else if (col.type == FieldTypes.MultiInput) {
                json[fieldId] = values[fieldId].toString();
              } else if (col.type == FieldTypes.ImageUpload) {
                json[fieldId] = values[fieldId];
                this.files.push(values[fieldId]);
              } else if (col.type == FieldTypes.Lookup && col.mode == 'multiple') {
                if (values[fieldId].length == 0) {
                } else {
                  json[fieldId] = values[fieldId];
                }
              } else {
                if (
                  typeof values[fieldId] !== 'undefined' &&
                  (values[fieldId] || values[fieldId] === 0)
                ) {
                  json[fieldId] = values[fieldId];
                }
              }
            } else {
              if (
                typeof values[fieldId] !== 'undefined' &&
                (values[fieldId] || values[fieldId] === 0)
              ) {
                json[fieldId] = values[fieldId];
              } else {
              }
            }
          }
        }
      }

      var request = {};
      let me = this;
      if (parentIdColumn) {
        json[parentIdColumn] = selectedRowParent[parentIdColumn];
      }
      if (isNewBackend) {
        if (this.props.activeRecordId == 'NEW_RECORD') {
          json.action = 'insert';
          if (isGuidSystem) {
            delete json.id;
          }
        } else {
          json.action = 'update';
          json[this.props.config.idColumn] = this.props.activeRecordId;
        }
      } else {
        if (this.props.activeRecordId == 'NEW_RECORD') {
          json.id = 0;
        } else {
          json.id = this.props.activeRecordId;
        }
      }

      request = json;
      if (this.props.config.beforeSave) {
        this.props.config.beforeSave(request);
      }

      API.triggerMultiPartPost(request.apiIdentifier, request, this.files)
        .then((response) => {
          this.setState({ loading: false });
          var data = response.data;
          if (data.success) {
            this.props.form.resetFields();
            for (var col of columns) {
              var formKey = col.dataIndex;
              if (!this.props.shouldNotResetFields) me.onChange(formKey, null);
            }
            this.files = [];
            if (this.props.config.resetFormFields) this.props.config.resetFormFields();
            if (callBack) callBack(data);
            if (closeable) toggle(true);
            else resetProps();
            this.success();
          } else if (data.info) {
            this.setState(
              {
                snackBarVisible: true,
                message: data.info,
                color: 'danger',
              },
              () => setTimeout(() => this.setState({ snackBarVisible: false, message: '' }), 5000),
            );
          } else {
            alert(t('Failed'));
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.response) alert(error.response.data.Message);
        });
    });
  };

  onChange = (field, control, type) => {
    if (type == 'file' || type == 'multiInput') {
      this.setState({ [field]: control });
      this.props.form.setFieldsValue({ [field]: value });
    } else if (control == null) {
      this.setState({ [field]: control, applyLocalChange: true });
      this.props.form.setFieldsValue({ [field]: value });
    } else if (control._isAMomentObject) {
      var value = '';
      if (typeof control === 'object') value = control; //.format('YYYY-MM-DD hh:mm:ss');
      this.setState({ [field]: value, applyLocalChange: true });
      this.props.form.setFieldsValue({ [field]: value });
    } else {
      var value = '';
      if (typeof control === 'object') {
        if (control.length >= 0) {
          value = control;
        } else value = control.target.value;
      } else if (
        typeof control === 'boolean' ||
        typeof control === 'string' ||
        typeof control === 'number'
      )
        value = control;
      if (value.charAt && value.charAt(0) == ' ') value = value.trim();
      if (typeof this.props.setShowConfMsg === 'function') this.props.setShowConfMsg(true);
      this.setState({ [field]: value, applyLocalChange: true });
      this.props.form.setFieldsValue({ [field]: value });
    }
  };

  getFieldRules = (item) => {
    const { notRequiredFields } = this.state;
    const id = item.dataIndex;
    const { t, selectedRow } = this.props;
    return [
      {
        required:
          item.type == FieldTypes.Toggle ? false : !notRequiredFields[id] && !!item.isRequired,
        message: `${item.title}` + ' ' + 'is required',
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.required && !notRequiredFields[id]) {
            if (value == null || typeof value == 'undefined') {
              return callback(true);
            } else if (
              (item.type === FieldTypes.String ||
                item.type === FieldTypes.Alphanumeric ||
                item.type === FieldTypes.Text ||
                item.type === FieldTypes.TextArea ||
                item.type === FieldTypes.Password ||
                item.type === FieldTypes.Numeric ||
                item.type === FieldTypes.Float ||
                item.type === FieldTypes.AjaxSelect ||
                item.type === FieldTypes.SearchAjax) &&
              (value == '' || value == ' ') &&
              !item.allowZeros
            ) {
              return callback(true);
            } else if (
              (item.type === FieldTypes.Number || item.type === FieldTypes.Amount) &&
              !/^-?\d*[.,]?\d*$/.test(value)
            ) {
              return callback(true);
            } else if (
              item.type === FieldTypes.Url &&
              !/^(ftp|http|https):\/\/[^ "]+$/.test(value)
            ) {
              rule.message = item.title + ' ' + 'must be a valid url';
              return callback(true);
            } else if (
              item.type === FieldTypes.MacAddress &&
              !/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/.test(value)
            ) {
              rule.message = item.title + ' ' + 'must be a valid Mac Address';
              return callback(true);
            } else if (
              item.type === FieldTypes.Email &&
              !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                value,
              )
            ) {
              rule.message = item.title + ' ' + 'must be a valid email';
              return callback(true);
            } else if (item.type === FieldTypes.AutoFill || item.type === FieldTypes.Lookup) {
              if (value === 0 && !item.allowZeros) {
                return callback(true);
              }
              if (value === '' || value.length == 0) {
                return callback(true);
              } else return callback();
            } else if (item.type === FieldTypes.MultiInput) {
              if (value.length == 0) {
                return callback(true);
              } else return callback();
            } else if (item.type === FieldTypes.Dragger) {
              var fileExtension = value?.name.match(/\.[0-9a-z]+$/i)[0];
              if (fileExtension != item.validExtn) {
                return callback(true);
              } else return callback();
            } else return callback();
          }
          return callback();
        },
      },
      {
        daterange: item.type == 'date' ? true : false,
        message: "Program's to date can not be less than max to date of program item",
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.daterange && !notRequiredFields[id] && value && selectedRow.ChildMaxDate) {
            if (rule.field === 'Valid To') {
              let momentchildMaxDate = moment(DateFormat.parse(selectedRow.ChildMaxDate));
              let childMaxDate = momentchildMaxDate.valueOf();
              let selectedToDate = value.valueOf();
              if (childMaxDate > selectedToDate) {
                return callback(true);
              } else {
                return callback();
              }
            }
          }
          return callback();
        },
      },
      {
        daterange: item.type == 'date' ? true : false,
        message: "Valid To can't be less than Valid From",
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.daterange && !notRequiredFields[id] && value) {
            if (rule.field === 'Valid From' || rule.field === 'Valid To') {
              if (rule.field === 'Valid From') {
                datevalidationobj['lower'] = value;
              } else if (rule.field === 'Valid To') {
                datevalidationobj['upper'] = value;
                // if(selectedRow.ValidFrom){;
                //   let momentValidFrmDate = moment(DateFormat.parse(selectedRow.ValidFrom));
                //    datevalidationobj['lower'] = momentValidFrmDate.valueOf();
                // }
              }
              if (
                datevalidationobj.hasOwnProperty('lower') &&
                datevalidationobj.hasOwnProperty('upper')
              ) {
                let date1 = datevalidationobj['lower'].valueOf();
                let date2 = datevalidationobj['upper'].valueOf();
                if (date1 > date2) {
                  return callback(true);
                } else {
                  datevalidationobj = {};
                  return callback();
                }
              }
            }
          }
          return callback();
        },
      },
      {
        daterange: item.type == 'date' ? true : false,
        message: "Valid To and Valid From should be in range of Program's date Interval",
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          let isProgramItemScreen = window.location.href.indexOf('ProgramItem') > -1;
          if (isProgramItemScreen) {
            let datevalidationparentobj = JSON.parse(
              localStorage.getItem('datevalidationparentobj'),
            )
              ? JSON.parse(localStorage.getItem('datevalidationparentobj'))
              : {};
            if (rule.daterange && !notRequiredFields[id] && value) {
              if (rule.field === 'Valid From' || rule.field === 'Valid To') {
                if (rule.field === 'Valid From') {
                  datevalidationparentobj['ProgramItemValidFrom'] = value.startOf('day').valueOf();
                  localStorage.setItem(
                    'datevalidationparentobj',
                    JSON.stringify(datevalidationparentobj),
                  );
                } else if (rule.field === 'Valid To') {
                  datevalidationparentobj['ProgramItemValidTo'] = value.startOf('day').valueOf();
                  localStorage.setItem(
                    'datevalidationparentobj',
                    JSON.stringify(datevalidationparentobj),
                  );
                }
                if (
                  datevalidationparentobj.hasOwnProperty('ProgramItemValidFrom') ||
                  datevalidationparentobj.hasOwnProperty('ProgramItemValidTo')
                ) {
                  let programitemvalidFrom = datevalidationparentobj['ProgramItemValidFrom'];
                  let programitemvalidTo = datevalidationparentobj['ProgramItemValidTo'];

                  if (rule.field === 'Valid From') {
                    return callback();
                  } else if (rule.field === 'Valid To') {
                    return callback();
                  }
                }
              }
            }
            return callback();
          } else {
            return callback();
          }
        },
      },
      {
        maxLengthExceed: item.type == FieldTypes.String && item.maxLimitExceeded ? true : false,
        message: `${item.title}` + ' ' + 'should be a valid % value',
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.maxLengthExceed) {
            if (!parseFloat(value) && value != 0) {
              return callback(true);
            }
            if (isNaN(Number(value))) {
              return callback(true);
            }
            if (parseFloat(value) > item.maxLimitExceeded) {
              return callback(true);
            }
          }
          return callback();
        },
      },
      {
        commaRestrict: item.type == FieldTypes.String && item.commaRestricted ? true : false,
        message: `${item.title}` + ' ' + 'cant have commas in it.',
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.commaRestrict) {
            if (value.indexOf(',') > -1) {
              return callback(true);
            }
          }
          return callback();
        },
      },
      {
        minLength: item.type == FieldTypes.String && item.minLimit ? true : false,
        message: `${item.title}` + ' ' + 'should be a valid % value',
        transform: (value) => (value && value.trim && value.trim()) || value,
        validator: (rule, value, callback) => {
          if (rule.minLength == 0) {
            if (parseFloat(value) < item.minLimit) {
              return callback(true);
            }
          }
          return callback();
        },
      },
      {
        validateMsg: item.validateMsg && item.type === FieldTypes.Numeric,
        validator: (rule, value, callback) => {
          if (rule.validateMsg) {
            if (item.maxValueValidate < value) {
              return callback('Max supported limit is' + ' ' + item.maxValueValidate);
            }
            if (item.minValueValidate > value) {
              return callback('Min supported limit is' + ' ' + item.minValueValidate);
            }
          }
          return callback();
        },
      },
      {
        validateMsg: item.validateMsg && item.type === FieldTypes.Float && item.checkFloatValue,
        validator: (rule, value, callback) => {
          if (rule.validateMsg) {
            if (item.maxValueValidate < value) {
              return callback('Max supported limit is' + ' ' + item.maxValueValidate);
            }
            if (item.minValueValidate > value) {
              return callback('Min supported limit is' + ' ' + item.minValueValidate);
            }
          }
          return callback();
        },
      },

      {
        validateMsg: item.validateMsg && item.type === FieldTypes.Numeric && item.checkIntValue,
        validator: (rule, value, callback) => {
          if (rule.validateMsg) {
            if (!(value % 1 === 0)) {
              return callback('Value must be a integer number');
            }
          }
          return callback();
        },
      },
      {
        validateMsg: item.validateMsg && item.type === FieldTypes.Float && item.checkFloatValue,
        validator: (rule, value, callback) => {
          if (rule.validateMsg) {
            if (
              !/(^-?\d\d*\.\d\d*$)|(^-?\.[0-9]\d\d*$)/.test(value) &&
              value !== '' &&
              value !== null
            ) {
              return callback('Value must be a decimal number');
            }
          }
          return callback();
        },
      },
    ];
  };

  defaultButtonsRender = () => {
    const { mode } = this.props;
    return (
      mode != 'view' && (
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {this.defaultButton().map((item) => {
              return (
                <Tooltip title={item.buttonText}>
                  <Button
                    className="dark:bg-gray-900 dark:text-white"
                    style={{ marginRight: '10px', marginTop: '45px' }}
                    onClick={() => item.onClick({ formPanel: this })}
                  >
                    {item.buttonText}
                  </Button>
                </Tooltip>
              );
            })}
            {/* {saveAndNextButton && (
            <Button style={{ marginRight: '10px' }} onClick={() => this.onSave(false)}>
              Save & New
            </Button>
          )}
          <Button style={{ marginRight: '10px' }} onClick={() => this.onSave(true)}>
            {saveButtonText || 'Save'}
          </Button>
          <Button
            onClick={() => {
              return toggle(false);
            }}
          >
            Cancel
          </Button> */}
          </Col>
        </Row>
      )
    );
  };

  defaultButton = () => {
    const { t, config, buttonClick, toggle } = this.props;
    let { saveAndNextButton, saveButtonText, customButtonsInForm } = config;
    let buttonsInForm = customButtonsInForm || {};
    let saveAndNextButtonObj = saveAndNextButton
      ? [
          {
            buttonText: t('Save & New'),
            onClick: () => this.onSave(false),
          },
        ]
      : [];

    if (saveButtonText == 'Add' && buttonClick == 'EDIT') {
      saveButtonText = 'Save';
    }
    if (buttonClick == 'CLONE') {
      saveButtonText = 'Clone';
    }

    let buttonsToMap = [
      ...saveAndNextButtonObj,
      ...(buttonsInForm.beforeSaveButton || []),
      {
        buttonText: saveButtonText || 'Save',
        onClick: () => this.onSave(true),
      },
      ...(buttonsInForm.afterSaveButton || []),
      {
        buttonText: 'Cancel',
        onClick: () => toggle(this.props.shouldRefresh || false),
      },
      ...(buttonsInForm.afterCancelButton || []),
      ...(buttonsInForm.afterSaveButton || []),
    ];
    return buttonsToMap;
  };

  formItemStyles = (item) => {
    return item.customStyle;
  };

  handleChange = (event, newValue) => {
    this.setState({ selectedTabs: newValue });
  };

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  renderFieldCompoenent = (item) => {
    if (item.hideInForm) {
      return <></>;
    }

    const { hideField } = this.state;
    const { combos, buttonClick, apiIdentifier } = this.props;
    var id = item.dataIndex;
    var index = hideField.findIndex((hideItem) => hideItem === id);
    if (index >= 0) return;

    if (apiIdentifier === 'planogram') {
      if (buttonClick === 'ADD' || buttonClick === 'EDIT') {
        if (item.showForBulk) {
          return;
        }
      }
      if (buttonClick === 'BULK') {
        if (item.showForAdd) {
          return;
        }

        if (item.showOnImportToggle && !this.state['IsImportDefinition']) {
          return;
        }
      }
    }

    var value = '';
    value = typeof this.state[id] === 'undefined' ? null : this.state[id];
    var data = [],
      params = {};
    if (item.ParentRecordType) {
      params = {
        ParentRecordType: item.ParentRecordType,
        ScopeId: this.state[item.ScopeId],
      };
    }
    if (item.queryParams) {
      params = {
        [item.queryParams]: this.state[item.queryParams],
      };
    }
    if (item.comboType) {
      data = combos[item.comboType] || [];
      if (item.filterBy && this.state[item.filterBy]) {
        data = data.filter((dataitem) => dataitem[item.filterBy] === this.state[item.filterBy]);
      }
      if (item.filterWithParent) {
        let { mappingId } = item;
        if (!mappingId) mappingId = 'LookupId';
        let { combo, value, indexTofilter, parentMappingId } = item.filterWithParent;
        if (!parentMappingId) parentMappingId = 'LookupId';
        if (this.state[value] && this.state[value] !== '') {
          let parentCombo = combos[combo].filter(
            (filterItem) => filterItem[parentMappingId] === this.state[value],
          );
          if (parentCombo.length > 0) {
            parentCombo = parentCombo[0][indexTofilter].split(',').map((item) => parseInt(item));
            data = data.filter((item) => parentCombo.indexOf(item[mappingId]) >= 0);
          }
        }
      }
    }
    return this.renderReturnComponent(item, id, value, data, params);
  };

  renderReturnComponent = (item, id, value, data, params) => {
    const { t, activeRecordId, combos, stringComboVal } = this.props;
    // const { getFieldDecorator } = this.props.form;
    let disabledFields = item.disabledField
      ? item.disabledField
      : item.disabledFieldBasedonCondition && this.state.isDisabledField
        ? this.state.isDisabledField
        : false;
    if (item.enableisNewRecordCanBeAdded) {
      item.isNewRecordCanBeAdded = item.enableisNewRecordCanBeAdded();
    }
    return item.title == 'gutter' ? (
      <Col
        span={item.colSpan || this.defaultColSpan}
        style={{
          height: (item.rowSpan && item.rowSpan * 25) || this.defaultMinHeight
        }}
      />
    ) : (
      <Col
        span={item.colSpan || this.defaultColSpan}
        key={item.title}
        className={`formitem_${item.dataIndex}`}
        style={{
          height: '100px',
          border: '1px solid #c1c0c0',
          paddingRight: '300px !important',
          borderRadius: '7px',
        }}
      >
        <Form.Item
          label={item.hideLabel ? undefined : item.title}
          style={this.formItemStyles(item)}
          name={id}
          rules={this.getFieldRules(item, t, id)}
          initialValue={value}
        >
          <div
            className={
              item.isNewRecordCanBeAdded || item.InfoIconLabel || item.informationIcon
                ? 'has-plus'
                : ''
            }
            style={{ width: '266px !important' }}
          >
            <ReturnComponent
              item={item}
              disabled={disabledFields}
              recProps={this.props}
              recState={this.state}
              data={data}
              comboType={item.comboType}
              name={id}
              fieldValue={value}
              activeRecordId={activeRecordId}
              stringComboVal={stringComboVal}
              onChange={(newValue, type, options) => {
                if (item.onChange) {
                  item.onChange(
                    newValue,
                    value,
                    this.onChange.bind(null, id),
                    {
                      formPanel: this,
                    },
                    options,
                  );
                } else this.onChange(id, newValue, type);
              }} //this.onChange.bind(null, id)
              params={params}
              translate={t}
            />
            {item.informationIcon && (
              <Tooltip title={item.information}>
                <InfoIcon className={`add-record ${item.title}`} />
              </Tooltip>
            )}
            {/* {item.InfoIconLabel && (              
              <CustomPopover item={item} />
            )}             */}
            {item.isNewRecordCanBeAdded && (
              <>
                plus-circle
                {/* <Icon
                  type="plus-circle"
                  className="add-record"
                  style={{ color: getThemeColor() }}
                  onClick={() =>
                    this.setState({
                      [item.modalProps.stateValue]: !this.state[item.modalProps.stateValue],
                    })
                  }
                /> */}
                <Modal
                  visible={this.state[item.modalProps.stateValue]}
                  footer={null}
                  destroyOnClose
                  width={1024}
                  onCancel={() => {
                    this.setState({
                      [item.modalProps.stateValue]: false,
                    });
                  }}
                >
                  <ChildForm
                    combos={combos}
                    parentField={item}
                    isChild
                    selectedRow={{}}
                    selectedRows={[{}]}
                    activeRecordId={'NEW_RECORD'}
                    {...item.modalProps}
                    config={item.modalProps}
                    t={t}
                    toggle={() =>
                      this.setState({
                        [item.modalProps.stateValue]: !this.state[item.modalProps.stateValue],
                      })
                    }
                  />
                </Modal>
              </>
            )}
          </div>
        </Form.Item>
      </Col>
    );
  };

  renderTabs = (selectedTabs, key, columns, prop, activeRecordId) => {
    return (
      <TabPanel value={selectedTabs} index={key}>
        {prop.component(this.props.selectedRow, this.props.setShouldRefresh, {
          formPanel: this,
        }) == 'default'
          ? columns && (
              <>
                <Row gutter={12}>
                  <Form className="login-form collapse-style">
                    {columns.map((item, index) => {
                      return item.isCollapse
                        ? this.getCollapseView(item, index)
                        : this.renderFieldCompoenent(item);
                    })}
                  </Form>
                </Row>
                {this.defaultButtonsRender()}
              </>
            )
          : prop.component(this.props.selectedRow, this.props.setShouldRefresh, {
              formPanel: this,
            })}
      </TabPanel>
    );
  };

  getTabView = () => {
    const { selectedTabs } = this.state;
    const { columns, formChilds, activeRecordId } = this.props;
    let x = document.getElementsByClassName('ant-modal-header');
    if (x.length > 0) {
      x[0].style.backgroundColor = getThemeColor();
    }

    return (
      <>
        <Tabs value={selectedTabs} onChange={this.handleChange} aria-label="mat-tabs-custome">
          {formChilds.map((prop, key) => {
            // if ((prop.showOnEditForm && activeRecordId !== 'NEW_RECORD') || !prop.showOnEditForm) {
            let disabledTab = false;
            if (prop.handleDisableTab) {
              disabledTab = prop.handleDisableTab(this.props.selectedRow, this.props);
            }

            if (prop.disableTabRender) {
              return prop.component(this.props.selectedRow, this.props.setShouldRefresh, {
                formPanel: this,
              });
            }

            return (
              <Tab
                key={key}
                disabled={
                  !(
                    (prop.showOnEditForm && activeRecordId !== 'NEW_RECORD') ||
                    !prop.showOnEditForm
                  ) || disabledTab
                }
                label={prop.title}
                style={selectedTabs == key ? { backgroundColor: getThemeColor() } : {}}
                {...this.a11yProps(key)}
              ></Tab>
            );
            // }
          })}
        </Tabs>
        {formChilds.map((prop, key) => {
          if (
            ((prop.showOnEditForm && activeRecordId !== 'NEW_RECORD') || !prop.showOnEditForm) &&
            !prop.disableTabRender
          ) {
            return this.renderTabs(selectedTabs, key, columns, prop, activeRecordId);
          }
        })}
      </>
    );
  };

  getCollapseView = (item, index) => {
    const { validForm, collapseViewShow } = this.state;
    return (
      <Collapse defaultActiveKey={collapseViewShow}>
        <Panel
          header={
            <div className="header-collapse">
              <div className="header-title">{item.header}</div>
              <div className="header-second">
                {validForm[item.header] && (
                  <CheckCircleOutlineIcon style={{ color: '#10d210', float: 'right' }} />
                )}
                {validForm[item.header] !== undefined && !validForm[item.header] && (
                  <ErrorOutlineIcon style={{ color: 'yellow', float: 'right' }} />
                )}
              </div>
            </div>
          }
          style={{ background: getThemeColor(), color: '#ffffff' }}
          key={
            index == 0 && !validForm[item.header]
              ? 'active'
              : validForm[item.header] !== undefined && !validForm[item.header]
                ? 'active'
                : 'deactive'
          }
        >
          {item.columns.map((ele) => this.renderFieldCompoenent(ele))}
        </Panel>
      </Collapse>
    );
  };

  renderSnackbar = () => {
    const { color, message, snackBarVisible } = this.state;
    return (
      <Snackbar
        place="tc"
        color={color}
        message={message}
        open={snackBarVisible}
        close={color == 'danger' ? true : undefined}
        closeNotification={color == 'danger' ? () => this.setState({ snackBarVisible: false }) : ''}
      />
    );
  };

  renderBanner = () => {
    const { editBanner } = this.props.config;
    const { t } = this.props;
    let infoIconColor = editBanner?.infoIconColor || 'red';
    let backgroundColor = editBanner?.background || '#f2e3e3';
    let bannerText = editBanner?.text || '';
    return (
      <div style={{ display: 'flex', padding: '5px', background: backgroundColor }}>
        <div>
          <InfoIcon style={{ color: infoIconColor }}></InfoIcon>
        </div>
        <div
          style={{
            fontSize: '15px',
            color: infoIconColor,
            fontWeight: 'bold',
            paddingLeft: '10px',
          }}
        >
          {bannerText}
        </div>
      </div>
    );
  };

  defaultLoader = () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      >
        <CircularProgress
          color="secondary"
          style={{ position: 'absolute', top: '50%', left: '50%' }}
        />
      </div>
    );
  };

  render() {
    let { hideField, loading, validForm } = this.state;
    let { columns, isFormTitle, t, buttonClick, selectedRows, isTabView, formChilds, classes } =
      this.props;

    // if(formChilds){
    //   columns.forEach(ele => {
    //     if(ele.isCollapse){
    //       if(collapseViewShow.length === 0){
    //         this.setState({collapseViewShow: [ele.header]});
    //       }
    //     }
    //   })
    // }

    buttonClickChild = buttonClick;

    if (buttonClick === 'ADD' && this.props.apiIdentifier === 'locationgroupdefinition') {
      hideField.push('SubClientId');
      hideField.push('LocationHierarchyId');
      hideField.push('ClientId');
      hideField.push('StartDate');
      hideField.push('EndDate');
    }

    if (this.props.apiIdentifier === 'planogram') {
      if (buttonClick === 'ADD' || buttonClick === 'EDIT') {
        hideField.push('dragDrop');
      }
      if (buttonClick === 'BULK') {
        hideField.push('PlanogramPSAFileName');
        hideField.push('PlanogramMediaPath');
      }
    }

    if (buttonClick === 'ADD' && this.props.apiIdentifier === 'programitem') {
      let upcolindex = columns.findIndex((col) => col.dataIndex === 'ProgramAreaId');
      columns[upcolindex].disabledField = false;
    } else if (buttonClick === 'EDIT' && this.props.apiIdentifier === 'programitem') {
      let upcolindex = columns.findIndex((col) => col.dataIndex === 'ProgramAreaId');
      columns[upcolindex].disabledField = false;
    }

    if (buttonClick === 'ADD' && this.props.apiIdentifier === 'programarea') {
      let upcolindex = columns.findIndex((col) => col.dataIndex === 'Area');
      columns[upcolindex].disabledField = false;
      upcolindex = columns.findIndex((col) => col.dataIndex === 'AreaType');
      columns[upcolindex].disabledField = false;
    } else if (buttonClick === 'EDIT' && this.props.apiIdentifier === 'programarea') {
      // let upcolindex = columns.findIndex(col => col.dataIndex === 'Area');
      // columns[upcolindex].disabledField = true;
      let upcolindex = columns.findIndex((col) => col.dataIndex === 'AreaType');
      columns[upcolindex].disabledField = true;
    }
    if (buttonClick === 'ADD' && this.props.apiIdentifier === 'program') {
      let updatecolindexadd;
      updatecolindexadd = columns.findIndex((col) => col.dataIndex === 'ValidFrom');
      columns[updatecolindexadd].disabledField = false;
      updatecolindexadd = columns.findIndex((col) => col.dataIndex === 'ValidTo');
      columns[updatecolindexadd].disabledField = false;
    } else if (buttonClick === 'EDIT' && this.props.apiIdentifier === 'program') {
      let updatecolindexadd;
      columns = JSON.parse(JSON.stringify(columns));
      updatecolindexadd = columns.findIndex((col) => col.dataIndex === 'ValidFrom');
      columns[updatecolindexadd].disabledField = true;
      updatecolindexadd = columns.findIndex((col) => col.dataIndex === 'ValidTo');
      // columns[updatecolindexadd].disabledField = true;
      columns[updatecolindexadd].disabledPastDateFromToday = false;
    } else if (buttonClick === 'CLONE' && this.props.apiIdentifier === 'program') {
      isFormTitle = 'Clone Program - ' + selectedRows[0].Name;
      let updatecloneindexadd;
      updatecloneindexadd = columns.findIndex((col) => col.dataIndex === 'ValidFrom');
      columns[updatecloneindexadd].disabledField = false;
      updatecloneindexadd = columns.findIndex((col) => col.dataIndex === 'ValidTo');
      columns[updatecloneindexadd].disabledField = false;
    } else if (buttonClick === 'CLONE' && this.props.apiIdentifier === 'programitem') {
      isFormTitle = 'Clone Program Item - ' + selectedRows[0].Name;
      let updatecloneindexadd;
      updatecloneindexadd = columns.findIndex((col) => col.dataIndex === 'ProgramAreaId');
      columns[updatecloneindexadd].disabledField = true;
    }

    if (buttonClick === 'ADD' && this.props.apiIdentifier === 'programitemquestion') {
      //add
      columns = columns.filter((col) => {
        return col.dataIndex === 'ProgramQuestionLibraryId';
      });
    } else if (buttonClick === 'EDIT' && this.props.apiIdentifier === 'programitemquestion') {
      let optionHide = [14399, 14402, 4204, 4206, 14403, 14404, 14405, 4202];
      let maxValHide = [14399, 14400, 14401, 4204, 14405, 4202];
      let minValHide = [14399, 14400, 14401, 14402, 4204, 14405, 4202];
      hideField.push('ProgramQuestionLibraryId');
      //scenetype appear
      if (this.state.QuestionLevelId === 2) {
        hideField.push('QuestionSubSceneIds');
      } else if (this.state.QuestionLevelId === 1) {
        let subIndex = hideField.findIndex((item) => item == 'QuestionSubSceneIds');
        if (subIndex > -1) hideField.splice(subIndex, 1);
      }

      if (optionHide.indexOf(this.state.QuestionTypeId) > -1) {
        //hide options
        hideField.push('Options');
      }
      if (minValHide.indexOf(this.state.QuestionTypeId) > -1) {
        //hide min value

        hideField.push('MinValue');
      }
      if (maxValHide.indexOf(this.state.QuestionTypeId) > -1) {
        //hide max value
        hideField.push('MaxValue');
      }
      isFormTitle = 'Edit Question'; //for edit
    }
    return (
      <div style={{ margin: '5px 16px' }} className={classes ? classes.antdIcon : ''}>
        {loading && this.defaultLoader()}
        {this.renderSnackbar()}
        {this.props.config?.editBanner && this.renderBanner()}
        {!formChilds && <h5 style={{ fontSize: '20px' }}>{isFormTitle ? isFormTitle : ''}</h5>}
        {formChilds && formChilds.length > 0 && this.getTabView()}
        {!formChilds && (
          <>
            <Row gutter={12} style={{ display: 'block' }}>
              <Form
                className={`login-form collapse-style formidentifier_${this.props.identifier}`}
                name="simpleForm"
                form={this.props.form}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  border: '1px solid #c1c0c0',
                  padding: '20px',
                  borderRadius: '7px',
                }}
              >
                {columns &&
                  columns.map((item, index) => {
                    return item.isCollapse
                      ? this.getCollapseView(item, index)
                      : this.renderFieldCompoenent(item);
                  })}
              </Form>
            </Row>
            {this.defaultButtonsRender()}
          </>
        )}
      </div>
    );
  }
}

SimpleForm.defaultProps = {
  identifier: '220',
  columns: [],
};

const ChildForm = connect()(
  class extends React.Component {
    render() {
      return <SimpleForm {...this.props} name="ChildForm" />;
    }
  },
);
const simpleFormStyle = {
  antdIcon: () => ({
    '& .anticon ': {
      color: getThemeColor(),
    },
  }),
};
const mapsStateToProps = ({ combos }) => {
  return { combos };
};

export default connect(mapsStateToProps)(
  withStyles(simpleFormStyle)((props) => {
    const [form] = Form.useForm();
    return <SimpleForm form={form} {...props}></SimpleForm>;
  }),
);

export { SimpleForm as SimpleFormClass, ReturnComponent };
