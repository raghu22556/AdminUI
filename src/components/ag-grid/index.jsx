import { Component } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-material.css';
//import 'ag-grid-enterprise';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-material.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import Pager from './pager';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../../../src/index.css';

import { isSingleReset } from '../../app-config';
import {
  BooleanFilter,
  CustomCellRenderer,
  OparationCellRenderer,
  ComboCellRenderer,
  ComboCellRendererMulti,
  DateCellRenderer,
  BooleanCellRenderer,
  SelectCellEditor,
  AutoFillCellEditor,
  ListFilter,
  DateFilter,
  TextFilter,
  NumberFilter,
  DateTimeWithTimeZoneCellRenderer,
  FloatCellRenderer,
  DateTimeCellRenderer,
  IconCellRenderer,
} from './ag-grid-components';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { Padding } from '@mui/icons-material';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
class CustomLoadingOverlay extends Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <CircularProgress color="secondary" />
      </div>
    );
  }
}

class AgGrid extends Component {
  constructor(props) {
    super(props);
    this.triggered = false;
    let columnDefs = [],
      isGridEditable = false;
    props.columns.map((item) => {
      const {
        type,
        //cellRenderer,
        cellEditor,
        editable,
        dataIndex,
        title,
        comboType,
        nofiltertype,
        notsortabletype,
        renderer,
        convert,
        width,
        getEditingValue,
        cellClass,
        minWidth,
        sortingOrder,
        hideInTable,
        checkValueBeforeChange,
        pinned,
      } = item;
      let sortable = true;
      if (typeof notsortabletype == 'boolean' && notsortabletype) sortable = false;
      let combos = this.props.combos[item.comboType];
      let decimal = null;
      var cellRenderer = '';
      if (type == 'combo' || type == 'autofill') {
        cellRenderer = 'comboCellRenderer';
        if (type === 'combo' && renderer === 'multiple') {
          cellRenderer = 'comboCellRendererMulti';
        }
      } else if (type == 'date') {
        cellRenderer = 'dateTimeCellRenderer';
        if (renderer == 'date') {
          cellRenderer = 'dateCellRenderer';
        } else if (convert == 'DateLocalizer') {
          cellRenderer = 'dateTimeWithTimeZoneCellRenderer';
        }
      } else if (type == 'boolean') {
        cellRenderer = 'booleanCellRenderer';
      } else if (type == 'number') {
        cellRenderer = 'customCellRenderer';
        if (renderer && renderer.indexOf('C') >= 0) {
          cellRenderer = 'floatCellRenderer';
          decimal = renderer.replace('C', '');
        }
      } else if (type == 'operation') {
        cellRenderer = 'oparationCellRenderer';
      } else if (type == 'Icon') {
        cellRenderer = 'iconCellRenderer';
      } else {
        cellRenderer = 'customCellRenderer';
      }
      if (editable && !isGridEditable) isGridEditable = editable;
      var config = {
        hide: hideInTable,
        headerClass: cellClass + '-header',
        //width: item.width,
        sortingOrder: sortingOrder || ['desc', 'asc', null],
        sortable,
        comboType: comboType,
        width: width || 130,
        headerName: title,
        title,
        field: dataIndex,
        editable: editable,
        cellRenderer: cellRenderer,
        cellEditor:
          type == 'combo'
            ? 'selectCellEditor'
            : type == 'autofill'
              ? 'autoFillCellEditor'
              : 'agTextCellEditor',
        filter: nofiltertype
          ? false
          : type == 'combo' || type == 'autofill'
            ? 'listFilter'
            : type == 'date'
              ? 'dateFilter'
              : type == 'boolean'
                ? 'booleanFilter'
                : type == 'number'
                  ? 'numberFilter'
                  : 'textFilter',
        filterParams: {
          applyButton: true,
          clearButton: true,
          // suppressSelectAll: true,
          suppressAndOrCondition: true,
        },
        type,
        getEditingValue,
        cellClass,
        minWidth: minWidth || 140,
        checkValueBeforeChange,
        comparator: () => false,
        decimal,
        pinned: pinned || false,
      };
      if (comboType && combos)
        config.filterParams = {
          values: combos.map((item) => item.DisplayValue),
        };
      if (type == 'date') config.filterParams.filterOptions = ['inRange'];
      columnDefs.push(config);
    });
    this.state = {
      popupParent: document.querySelector('body'),
      isGridEditable,
      type: null,
      pageSize: props.pageSize || 50,
      currentPage: 0,
      columnDefs,
      editType: 'fullRow',
      rowData: [],
      gridOptions: {
        singleClickEdit: true,
        enableCellTextSelection: true,
        defaultColDef: {
          resizable: true,
          sortable: true,
          minWidth: 140,
          maxWidth: 400,
          editable: false,
          flex: 1,
        },
        api: {},
        columnApi: {},
        enableSorting: true,
        enableFilter: true,
        onFilterChanged: this.onFilterChanged,
        onSortChanged: this.onSortChanged,
        components: {
          customCellRenderer: CustomCellRenderer,
          oparationCellRenderer: OparationCellRenderer,
          comboCellRenderer: ComboCellRenderer,
          comboCellRendererMulti: ComboCellRendererMulti,
          booleanFilter: BooleanFilter,
          dateCellRenderer: DateCellRenderer,
          booleanCellRenderer: BooleanCellRenderer,
          dateTimeWithTimeZoneCellRenderer: DateTimeWithTimeZoneCellRenderer,
          floatCellRenderer: FloatCellRenderer,
          dateTimeCellRenderer: DateTimeCellRenderer,
          selectCellEditor: SelectCellEditor,
          autoFillCellEditor: AutoFillCellEditor,
          listFilter: ListFilter,
          dateFilter: DateFilter,
          customNoRowsOverlay: this.CustomNoRowsOverlay,
          customLoadingOverlay: CustomLoadingOverlay,
          textFilter: TextFilter,
          numberFilter: NumberFilter,
          iconCellRenderer: IconCellRenderer,
        },
        noRowsOverlayComponent: 'customNoRowsOverlay',
        loadingOverlayComponent: 'customLoadingOverlay',
        context: { componentParent: this },
      },
      rowModelType: 'infinite',
      total: 0,
    };
    this.requestOptions = '';
  }

  CustomNoRowsOverlay = () => {
    const { isFetching } = this.props;
    return <div style={{ height: '100%' }}>{!isFetching && <h3>No rows to show</h3>}</div>;
  };

  componentWillReceiveProps({ isRefresh, total, isFetching, data }) {
    if (isRefresh && isRefresh != this.props.isRefresh) {
      this.loadData(true);
    }
    if (total && total !== this.props.total && total > 0) this.setState({ total });
    if (isFetching !== this.props.isFetching && this.gridApi) {
      if (isFetching) {
        this.gridApi.showLoadingOverlay();
        this.gridApi.ensureColumnVisible('Operation');
      } else if (!isFetching && data.length == 0) {
        this.setState({ total: 0 });
        this.gridApi.showNoRowsOverlay();
      } else this.gridApi.hideOverlay();
    }
  }

  getFilter = (filterInfo) => {
    let filter = [];
    for (var key in filterInfo) {
      const {
        type,
        value,
        filterType,
        dateFrom,
        filter: filterValue,
        dateTo,
        gt,
        lt,
        eq,
        dateEqual,
      } = filterInfo[key];
      let v = [];
      var column = this.gridApi.getColumnDef(key);
      // To Do: Need to handle other filter types
      if (type == 'boolean') {
        filter.push({ field: key, data: { type, value } });
      } else if (type == 'text') {
        filter.push({ field: key, data: { type: 'string', value: value } });
      } else if (filterType == 'date') {
        if (dateFrom)
          if (dateFrom) {
            let fromValue = '';
            if (key == 'CreatedDate' || key == 'ModifiedDate') {
              fromValue = dateFrom.utc().format();
            } else {
              fromValue = moment(dateFrom).format('MM/DD/YYYY');
            }
            filter.push({
              field: key,
              data: {
                comparison: 'gt',
                type: filterType,
                value: fromValue,
              },
            });
          }
        if (dateTo) {
          let toValue = '';
          if (key == 'CreatedDate' || key == 'ModifiedDate') {
            toValue = dateTo.utc().format();
          } else {
            toValue = moment(dateTo).format('MM/DD/YYYY');
          }
          filter.push({
            field: key,
            data: {
              comparison: 'lt',
              type: filterType,
              value: toValue,
            },
          });
        }
        if (dateEqual)
          filter.push({
            field: key,
            data: {
              comparison: 'eq',
              type: filterType,
              value: moment(dateEqual).format('MM/DD/YYYY'),
            },
          });
      } else if (type == 'listCustom') {
        filter.push({
          field: key,
          data: { type: 'list', value: value },
        });
      } else if (type == 'number') {
        if (gt) {
          filter.push({
            field: key,
            data: {
              comparison: 'gt',
              type: 'numeric',
              value: gt,
            },
          });
        }
        if (lt) {
          filter.push({
            field: key,
            data: {
              comparison: 'lt',
              type: 'numeric',
              value: lt,
            },
          });
        }
        if (eq) {
          filter.push({
            field: key,
            data: {
              comparison: 'eq',
              type: 'numeric',
              value: eq,
            },
          });
        }
      }
    }
    return filter;
  };

  getSortInfo = (sortInfo) => {
    if (sortInfo) {
      return sortInfo.map((item) => {
        return { sort: item.colId, dir: item.sort };
      });
    } else {
      return null;
    }
  };

  getSortInfo = () => {
    var colState = this.gridApi.getColumnState();
    var sortState = colState
      .filter(function (s) {
        return s.sort != null;
      })
      .map(function (s) {
        return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
      });
    return sortState;
  };

  getFilterData = () => {
    return this.getFilter(this.gridApi.getFilterModel());
  };

  getOptions = (api) => {
    api.hidePopupMenu();
    return {
      currentPage: this.state.currentPage,
      limit: this.state.pageSize,
      filter: this.getFilter(api.getFilterModel()),
      sortInfo: this.getSortInfo(this.getSortInfo()),
    };
  };

  onSortChanged = (e) => {
    this.loadData();
  };

  loadData = (enableForceRefresh) => {
    let defaultSort = null;
    if (
      this.gridApi.getSortModel &&
      this.gridApi.getSortModel() == 0 &&
      this.props.gridPreferences
    ) {
      const { sortInfo } = JSON.parse(this.props.gridPreferences || '{}');

      if (sortInfo && sortInfo.length > 0) {
        defaultSort = sortInfo[0];

        var colId = sortInfo[0].sort;
        var sortDir = sortInfo[0].dir;

        var column = this.columnApi.getColumn(colId);
        if (column) {
          column.setSort(sortDir);
        }
      }
    }
    var requestOptions = this.getOptions(this.gridApi);

    /*if (this.gridApi.getSortModel() == 0 && defaultSort) {
      requestOptions.sortInfo.push(defaultSort);
    }*/
    if (
      this.requestOptions != JSON.stringify(requestOptions) ||
      this.props.enableAdvanceSearch ||
      enableForceRefresh
    ) {
      this.requestOptions = JSON.stringify(requestOptions);
      this.props.loadData(requestOptions);
    }
  };

  onFilterChanged = (e) => {
    this.state.currentPage = 0;
    this.loadData();
  };

  onGridReady = (params) => {
    const agGridReady = this;
    this.gridApi = params.api;
    this.gridApi.getFilterData = this.getFilterData;
    this.columnApi = params.columnApi;
    const { gridPreferences } = this.props;
    const { sortInfo, filterInfo } = JSON.parse(gridPreferences || '{}');
    let defaultSort = null;
    if (sortInfo && sortInfo.length > 0) {
      defaultSort = sortInfo.map((item) => ({
        colId: item.sort,
        sort: item.dir,
      }));
    }
    var column = defaultSort ? this.columnApi.getColumn(defaultSort[0].colId) : null;
    if (column) {
      column.setSort(defaultSort[0].sort);
    }

    this.props.onGridReady(params);
    if (this.props.autoRefresh) {
      this.loadData();
    }

    params.api.addGlobalListener(function (type, event) {
      /*if (type == 'sortChanged') {
        if (event.api.getSortModel() == 0 && defaultSort) {
          event.api.setSortModel(defaultSort);
        }
      }*/
      if (type == 'columnVisible') {
        if (event.columnApi.columnController.allDisplayedColumns.length == 0) {
          const colId = event.columnApi.columnController.getAllGridColumns()[1].colId;
          params.api.columnController.setColumnVisible(colId, true);
          params.api.hidePopupMenu();
        }
      }
      if (type == 'selectionChanged') {
        const {
          config: { child },
          dispatch,
        } = agGridReady.props;
        if (child && child.length > 0) {
          const { idColumn, identifier, actions } = agGridReady.props.config;
          const data = event.api.getSelectedRows()[0] || {};
          dispatch(actions.setList({ selectedRowParent: data }));
          let ParentEntity = identifier.split('_');
          child.map((item) => {
            var options = {
              PageNo: 0,
              PageSize: 50,
              ParentEntity: ParentEntity[ParentEntity.length - 1],
              ParentEntityField: idColumn,
              ParentId: data[idColumn],
            };
            if (item.comboTypes) {
              var combos = [];
              for (var combo of item.comboTypes) {
                combos.push(combo);
                // TO DO: Need to see why childs are loaded on parent row click
                /*if (!combo.loaded) {
                  //combo.loaded = true;
                  combos.push(combo);
                }*/
              }
              options.comboTypes = combos;
            }
            dispatch(item.actions.list(options));
          });
        }
      }
    });
  };

  onPageChange = (currentPage) => {
    this.state.currentPage = currentPage;
    this.loadData();
  };

  onPageSizeChange = (pageSize) => {
    var requestOptions = this.getOptions(this.gridApi);
    requestOptions.limit = pageSize;
    // To Do: need to send default Sort options when page size is changed
    this.props.loadData(requestOptions);
    this.setState({ pageSize });
  };

  onSelectionChanged = () => {
    var selectedRows = this.gridApi.getSelectedRows();
    if (!selectedRows[0]) return;
    this.props.onRowChange(null, selectedRows);
  };

  getMainMenuItems = ({ defaultItems, columnApi, column }) => {
    const { gridPreferences } = this.props;
    const { sortInfo, filterInfo } = JSON.parse(gridPreferences || '{}');
    let sort = null;
    if (sortInfo && sortInfo.length > 0) {
      sort = sortInfo.map((item) => ({ colId: item.sort, sort: item.dir }));
    }
    if (filterInfo && filterInfo.length > 0) {
      // TO DO : need to handle for filtering
    }
    if (isSingleReset) {
      let MenuItems = defaultItems.slice(0, 5);
      MenuItems.push({
        name: 'Reset Columns',
        action: () => {
          this.gridApi.setFilterModel(null);
          this.gridApi.setSortModel(sort);
          columnApi.columnController.resetColumnState(false, 'contextMenu');
        },
      });
      return MenuItems;
    } else {
      let MenuItems = defaultItems;
      if (column.colDef.sortable) {
        MenuItems.push({
          name: 'Reset Filters',
          action: () => {
            this.gridApi.setFilterModel(null);
            this.gridApi.setSortModel(sort);
          },
        });
      }

      return MenuItems;
    }
  };

  tabToNextCell = (params) => {
    var previousCell = params.previousCellPosition;
    var lastRowIndex = previousCell.rowIndex;
    var nextRowIndex = params.backwards ? lastRowIndex - 1 : lastRowIndex + 1;
    var renderedRowCount = this.gridApi.getModel().getRowCount();
    if (nextRowIndex < 0) {
      nextRowIndex = 0;
    }
    if (nextRowIndex >= renderedRowCount) {
      nextRowIndex = renderedRowCount - 1;
    }
    var result = {
      rowIndex: nextRowIndex,
      column: previousCell.column,
      floating: previousCell.floating,
    };
    return result;
  };
  
  onCellClicked = (event) => {
    if (event.column.colDef.title === 'Action') {
      event.api.deselectAll();
    }
    if (this.props.onCellClicked) {
      this.props.onCellClicked(event);
    }
  };

  render() {
    const { data, hidePaging, height, pagination, onRowDoubleClicked, onCellClicked } = this.props;
    const { pageSize, total, isGridEditable } = this.state;

    return (
      <div className="ag-theme-material">
        <div
          style={{
            width: '100%',
            fontFamily: 'Poppins',
          }}
        >
          <div
            className="ag-theme-alpine custom-horizontal-scrollbar"
            style={{ height: height || 'calc(100vh - 200px)', minHeight: '500px', width: '100%' }}
          >
            <AgGridReact
              popupParent={this.state.popupParent}
              onGridReady={this.onGridReady}
              gridOptions={this.state.gridOptions}
              columnDefs={this.state.columnDefs}
              rowData={data}
              // rowModelType={this.state.rowModelType}
              // onPaginationChanged={this.paginationChanged}
              suppressPaginationPanel={true}
              editType={this.state.editType}
              getMainMenuItems={this.getMainMenuItems}
              rowSelection="single"
              stopEditingWhenGridLosesFocus={true}
              onSelectionChanged={this.onSelectionChanged}
              suppressContextMenu={true}
              tabToNextCell={this.tabToNextCell}
              onCellValueChanged={(node) => {
                if (isGridEditable && node.oldValue !== node.newValue) node.data.modified = true;
              }}
              onRowDoubleClicked={(node) => {
                if (onRowDoubleClicked) onRowDoubleClicked(node);
              }}
              onCellClicked={this.onCellClicked}
              rowClass="ag-row"
            />
          </div>
        </div>
        {!hidePaging && (
          <Pager
            title={'table'}
            currentPage={this.state.currentPage}
            pageSize={pageSize}
            loadData={this.loadData}
            totalRecords={total}
            totalPage={Math.ceil(total / pageSize) || 0}
            onPageChange={this.onPageChange}
            onPageSizeChange={this.onPageSizeChange}
            reloadData={this.reloadData}
            isLoading={this.props.isFetching}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

export default connect()(AgGrid);
