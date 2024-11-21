import React, { PureComponent } from 'react';
import BaseView from './BaseView/BaseView';
//import { Actions } from 'core/redux-helper';
import { defaultGridColumns } from '../core/utils';
import { Overides } from '../entityconfig/configOverides';

class DynamicBaseView extends BaseView {
  constructor(props) {
    super(props);
    var tableName = props.tableName;
    var config = {
      ...generateConfig(tableName),
      ...Overides['Overide_' + tableName],
    };
    if (config.childs().length == 1 && config.childs()[0].childs().length == 0) {
      config.childView = 'flex';
    }
    this.config = this.constructConfig(config);
  }
}

const constructTabTitle = (config, idColumn) => {
  let titleColumns = [];
  var columns = config.details
    .filter(
      (item) =>
        item.dataIndex != 'CreatedBy' &&
        item.dataIndex != 'CreatedDate' &&
        item.dataIndex != 'ModifiedBy' &&
        item.dataIndex != 'ModifiedDate' &&
        item.dataIndex != idColumn,
    )
    .filter((item) => item.editor && item.editor.type != 'combo')
    .map((item) => item);
  if (columns.length <= 3) {
    columns.forEach((item) => {
      titleColumns.push(item.dataIndex);
    });
  } else {
    columns.slice(0, 3).forEach((item) => {
      titleColumns.push(item.dataIndex);
    });
  }
  return titleColumns;
};

const constructGridColumns = (config, idColumn) => {
  var columns = config.details
    .filter(
      (item) =>
        item.dataIndex != 'CreatedBy' &&
        item.dataIndex != 'CreatedDate' &&
        item.dataIndex != 'ModifiedBy' &&
        item.dataIndex != 'ModifiedDate' &&
        item.dataIndex != idColumn,
    )
    .map((item) => {
      let returnItem = {
        dataIndex: item.dataIndex,
        header: item.header,
      };
      if (item.editor) {
        if (item.editor.type) {
          if (item.editor.type == 'combo') {
            if (item.editor.isMultiple) {
              returnItem = {
                ...returnItem,
                type: 'combo',
                comboType: item.editor.lookUpMapping
                  ? item.editor.lookUpMapping
                  : item.editor.comboType,
                renderer: 'multiple',
              };
            } else {
              returnItem = {
                ...returnItem,
                type: 'combo',
                comboType: item.editor.lookUpMapping
                  ? item.editor.lookUpMapping
                  : item.editor.comboType,
              };
            }
          } else if (item.editor.type == 'date' || item.editor.type == 'datetime') {
            returnItem = { ...returnItem, type: 'date' };
          } else if (item.editor.type == 'float' || item.editor.type == 'int') {
            returnItem = { ...returnItem, type: 'number' };
          } else if (item.editor.type == 'boolean') {
            returnItem = { ...returnItem, type: 'boolean' };
          } else {
            //debugger;
          }
        }
      }
      return returnItem;
    });
  return columns;
};

const constructFormColumns = (config, idColumn) => {
  var columns = config.details
    .filter(
      (item) =>
        item.dataIndex != 'CreatedBy' &&
        item.dataIndex != 'CreatedDate' &&
        item.dataIndex != 'ModifiedBy' &&
        item.dataIndex != 'ModifiedDate' &&
        item.dataIndex != idColumn,
    )
    .map((item) => {
      var returnItem = {
        dataIndex: item.dataIndex,
        header: item.header,
      };
      if (item.editor) {
        if (item.editor.isRequired) {
          returnItem.isRequired = true;
        }
        if (item.editor.type) {
          if (item.editor.type == 'combo') {
            if (item.editor.isMultiple) {
              returnItem = {
                ...returnItem,
                type: 'combo',
                comboType: item.editor.lookUpMapping
                  ? item.editor.lookUpMapping
                  : item.editor.comboType,
                mode: 'multiple',
              };
            } else {
              returnItem = {
                ...returnItem,
                type: 'combo',
                comboType: item.editor.lookUpMapping
                  ? item.editor.lookUpMapping
                  : item.editor.comboType,
              };
            }
          } else if (item.editor.type == 'date') {
            returnItem = { ...returnItem, type: 'date' };
          } else if (item.editor.type == 'datetime') {
            returnItem = { ...returnItem, type: 'datetime' };
          } else if (item.editor.type == 'float' || item.editor.type == 'int') {
            returnItem = { ...returnItem, type: item.editor.type };
          } else if (item.editor.type == 'boolean') {
            returnItem = { ...returnItem, type: 'boolean' };
          }
        }
      }
      return returnItem;
    });
  return columns;
};

const constructCombos = (config, idColumn) => {
  var columns = config.details
    .filter(
      (item) =>
        item.dataIndex != 'CreatedBy' &&
        item.dataIndex != 'CreatedDate' &&
        item.dataIndex != 'ModifiedBy' &&
        item.dataIndex != 'ModifiedDate' &&
        item.dataIndex != idColumn &&
        item.editor &&
        item.editor.type &&
        item.editor.type == 'combo' &&
        (item.editor.comboType || item.editor.lookUpMapping),
    )
    .map((item) => {
      var returnItem = {};
      if (item.editor.lookUpMapping) {
        returnItem = {
          type: item.editor.lookUpMapping,
          lookUpType: item.editor.lookUpMapping,
          ValueField: item.editor.mappingValueField,
        };
      } else {
        returnItem = {
          type: item.editor.comboType,
          ValueField: item.editor.mappingValueField,
          IDField: item.editor.mappingIdField,
        };
      }
      return returnItem;
    });
  return columns;
};

const constructChilds = (config) => {
  if (config.childs) {
    var childItems = [];
    for (var item of config.childs.split(',')) {
      childItems.push({
        ...generateConfig(item),
        ...Overides['Overide_' + item],
      });
    }
    return childItems;
  } else {
    return [];
  }
};

const generateConfig = (tableName) => {
  let masterConfig = JSON.parse(localStorage.entityMapping);
  let config = masterConfig[tableName];
  let idColumn = config.entity + 'Id';
  return {
    key: tableName.toString(),
    title: config.title,
    idColumn: idColumn,
    //listAPI: Actions['list' + config.entity],
    getGridColumns: () => [...constructGridColumns(config, idColumn), ...defaultGridColumns()],
    getFormColumns: () => [...constructFormColumns(config, idColumn)],
    childs: () => [...constructChilds(config)],
    comboTypes: [...constructCombos(config, idColumn)],
    tabTitle: constructTabTitle(config, idColumn),
  };
};

export { generateConfig };

export default DynamicBaseView;
