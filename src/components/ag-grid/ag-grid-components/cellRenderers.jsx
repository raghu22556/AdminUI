import React, { PureComponent } from 'react';
import DropOption from '../../../components/DropOption';
import Dates from '../../../core/utils/date';

class CustomCellRenderer extends PureComponent {
  render() {
    const { value } = this.props;
    return <span title={value}>{value}</span>;
  }
}

class IconCellRenderer extends PureComponent {
  render() {
    return (
      <img
        src={require('./small-right.svg')}
        style={{
          position: 'relative',
          left: -12,
        }}
      />
    );
  }
}

class ComboCellRenderer extends PureComponent {
  constructor(props) {
    super(props);

    var comboType = this.props.colDef.comboType;
    let value = '';
    if (this.props.context.componentParent.props.combos[comboType])
      value = this.props.context.componentParent.props.combos[comboType].find(
        (item) => item.LookupId == props.value,
      );
    this.state = {
      value,
      defaultValue: value,
      isChanged: false,
    };
  }

  refresh = (props) => {
    const { defaultValue } = this.state;
    if (!this.state.value || props.value !== this.state.value.LookupId) {
      var comboType = this.props.colDef.comboType;
      let value = '',
        isWarning = true;
      const combos = this.props.context.componentParent.props.combos;
      const checkWarning = this.props.colDef.checkWarning;
      if (combos[comboType]) {
        value = combos[comboType].find((item) => item.LookupId == props.value);
        if (checkWarning) {
          isWarning = defaultValue[checkWarning] == value[checkWarning];
        } else isWarning = false;
      }
      this.setState({ value, isChanged: true, isWarning });
    }
    return true;
  };

  render() {
    const { value, isChanged, isWarning } = this.state;

    return (
      <span
        className={isChanged ? (isWarning ? 'value-changed-yellow' : 'value-changed-red') : ''}
        title={value && value.DisplayValue}
      >
        {value && value.DisplayValue}
      </span>
    );
  }
}

class ComboCellRendererMulti extends PureComponent {
  constructor(props) {
    super(props);
    let filterVal = props.value && props.value.split ? props.value.split(',') : '';
    if (filterVal == '') {
      this.state = {
        value: [],
      };
    } else {
      var comboType = this.props.colDef.comboType;
      let value = [];
      let combos = this.props.context.componentParent.props.combos;
      if (combos[comboType] && combos[comboType].length > 0) {
        value = combos[comboType].filter((item) => {
          return filterVal.indexOf(item.LookupId.toString()) >= 0;
        });
      }

      value = value.map((item) => item.DisplayValue).toString();
      this.state = {
        value,
      };
    }
  }

  render() {
    const { value } = this.state;

    return <span title={value}>{value}</span>;
  }
}

class OparationCellRenderer extends PureComponent {
  constructor(props) {
    super(props);
    var isFullAccess = sessionStorage.getItem('fullAccess');
    this.state = {
      options:
        isFullAccess == 0
          ? [{ key: 'View', name: 'View' }]
          : [
              // { key: 'View', name: 'View' },
              { key: 'Update', name: 'Edit' },
              { key: 'Delete', name: 'Delete' },
            ],
    };
  }

  componentDidMount() {
    if (this.props.data.ControlRoomRequestId) {
      this.setState({
        options: [{ key: 'Reply', name: 'Reply' }],
      });
    } else
      this.setState({
        options: this.state.options,
      });
  }

  handleMenuClick = (e) => {
    this.props.context.componentParent.props.selectRow(this.props.rowIndex, e.key);
  };

  render() {
    return (
      <>
        <DropOption
          onMenuClick={(e) => this.handleMenuClick(e)}
          menuOptions={this.state.options}
          dropdownProps={{ trigger: ['click'] }}
        />
      </>
    );
  }
}

class DateTimeCellRenderer extends PureComponent {
  render() {
    let { value } = this.props;
    if (value) {
      return (
        <span title={Dates.DateTimeWithLocalTimeZone(value)}>
          {Dates.DateTimeWithLocalTimeZone(value)}
        </span>
      );
    } else {
      return '';
    }
  }
}

class BooleanCellRenderer extends PureComponent {
  render() {
    let { value } = this.props;
    return <span title={value ? 'Yes' : 'No'}>{value ? 'Yes' : 'No'}</span>;
  }
}

class DateTimeWithTimeZoneCellRenderer extends PureComponent {
  render() {
    let { value } = this.props;

    if (value) {
      return (
        <span title={Dates.DateTimeWithLocalTimeZone(value)}>
          {Dates.DateTimeWithLocalTimeZone(value)}
        </span>
      );
    } else {
      return '';
    }
  }
}

class DateCellRenderer extends PureComponent {
  render() {
    let { value } = this.props;
    if (value) {
      return <span title={Dates.standardDate(value)}>{Dates.standardDate(value)}</span>;
    } else {
      return '';
    }
  }
}

class FloatCellRenderer extends PureComponent {
  render() {
    const {
      value,
      colDef: { decimal },
    } = this.props;
    if (value == null || isNaN(value)) {
      return <span title={value}>{value}</span>;
    } else {
      let parsedecimal = parseInt(decimal),
        parsevalue = parseFloat(value).toFixed(parsedecimal);
      return <span title={parsevalue}>{parsevalue}</span>;
    }
  }
}

export {
  CustomCellRenderer,
  OparationCellRenderer,
  ComboCellRenderer,
  ComboCellRendererMulti,
  DateCellRenderer,
  BooleanCellRenderer,
  DateTimeWithTimeZoneCellRenderer,
  FloatCellRenderer,
  DateTimeCellRenderer,
  IconCellRenderer,
};
