import React from 'react';
import { Button, Menu } from 'antd';
import GridConfig from './config';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
const { strings, paging } = GridConfig;

const Pagination = () => <div>Need to implement</div>;
export default class Pager extends React.PureComponent {
  constructor(props) {
    super(props);

    var methods = [
      'firstPage',
      'previousPage',
      'nextPage',
      'lastPage',
      'onCustomPageNoChange',
      'onkeyPressEvent',
      'refresh',
      'onPageSizeChange',
      'refreshGridPage',
    ];
    for (var method of methods) {
      this[method] = this[method].bind(this);
    }
  }

  firstPage() {
    this.onPageChange(0);
  }

  previousPage() {
    const { currentPage, pageSize, totalRecords, totalPage } = this.props;
    let newPage = 0;
    if (!(currentPage * pageSize + 1 < totalRecords)) {
      newPage = totalPage - 1;
    } else {
      newPage = currentPage;
    }

    this.onPageChange(newPage - 1);
  }

  nextPage() {
    this.onPageChange(this.props.currentPage + 1);
  }

  lastPage() {
    this.onPageChange(this.props.totalPage - 1);
  }

  onPageSizeChange(item) {
    this.props.onPageSizeChange(item.key);
  }

  onCustomPageNoChange(event) {
    var value = Number(event.target.value) - 1;
    value = value <= 0 ? 0 : value >= this.props.totalPage ? this.props.totalPage - 1 : value;
    this.onPageChange(value);
  }

  onkeyPressEvent(event) {
    if (event && event.key === 'Enter') {
      event.preventDefault();
      var value = Number(event.target.value) - 1;
      value = value <= 0 ? 0 : value >= this.props.totalPage ? this.props.totalPage - 1 : value;
      this.onPageChange(value);
    }
  }

  onPageChange(current) {
    const { totalPage, isLoading } = this.props;
    if (isLoading) return;
    if (totalPage == current || current < 0) return;
    this.props.onPageChange(current);
  }

  refresh() {
    this.props.reloadData();
  }
  refreshGridPage() {
    this.props.loadData(true);
  }

  getPagingbar({ totalRecords, currentPage, pageSize, title, totalPage }) {
    if (totalRecords == 1) {
      return (
        <label className="display_record display">
          <span className="display-no-of-record">{strings.Displaying}: </span> 1 {' of '} 1{' '}
          {' Record'}
        </label>
      );
    }

    if (totalRecords != 0) {
      if (currentPage * pageSize + 1 < totalRecords) {
        return (
          <label className="display_record display">
            <span className="display-no-of-record">{strings.Displaying}: </span>{' '}
            {currentPage * pageSize + 1}
            {' - '}
            {currentPage < totalPage - 1 ? currentPage * pageSize + pageSize : totalRecords}{' '}
            {' of '} {totalRecords} {' Records '}
          </label>
        );
      } else {
        return (
          <label className="display_record display">
            <span className="display-no-of-record">{strings.Displaying}: </span> {currentPage}
            {' - '}
            {totalRecords}
            {' of '} {totalRecords} {' Records'}
          </label>
        );
      }
    } else {
      return <label className="display_record">{title + ' ' + strings.DisplayingNoRecords}</label>;
    }
  }

  getTotalPages(pages, currentPage) {
    var a = [];
    for (let i = 1; i <= pages; i++) {
      if ((currentPage + 3 >= i && i >= currentPage - 3) || i == 1 || i == pages) {
        if ((currentPage + 3 == i || i == currentPage - 3) && 1 !== i)
          a.push({
            text: '...',
            active: i == currentPage,
            onClick: () => this.onPageChange(currentPage + 3 == i ? i + 4 : i - 4),
          });
        else
          a.push({
            text: i,
            active: i == currentPage,
            onClick: () => this.onPageChange(i - 1),
          });
      }
      // if (currentPage + pages - 5 < i) {
      //   a.push({ text: i, active: i == currentPage, onClick: () => this.onPageChange(i) })
      // }
    }
    return a;
  }

  render() {
    const {
      firstPage,
      previousPage,
      nextPage,
      lastPage,
      onCustomPageNoChange,
      onkeyPressEvent,
      refresh,
      refreshGridPage,
      onPageSizeChange,
    } = this;
    const { title, currentPage, pageSize, totalRecords, totalPage, isLoading, pagination } =
      this.props;
    const menu = (
      <Menu onClick={onPageSizeChange}>
        {paging.options.map((item) => (
          <Menu.Item eventKey={item} key={item}>
            {item}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <>
        {totalPage > 0 ? (
          <div
            id={isLoading ? 'IRCQCPageination' : ''}
            class="ag-paging-panel ag-unselectable dark:bg-gray-900"
            style={{
              padding: pagination == 'compressed' ? 'unset' : 'inherit',
              paddingRight: '10px',
              overflow: 'hidden',
            }}
          >
            <span
              class="ag-paging-row-summary-panel dark:text-white"
              style={{
                margin: pagination == 'compressed' ? 'unset' : 'inherit',
              }}
            >
              <span>{currentPage * pageSize + 1}</span> to{' '}
              <span>
                {currentPage < totalPage - 1 ? currentPage * pageSize + pageSize : totalRecords}
              </span>{' '}
              of <span>{totalRecords}</span>
            </span>
            <span
              class="ag-paging-page-summary-panel dark:text-white"
              style={{
                marginLeft: pagination == 'compressed' ? 'inherit' : '32px',
              }}
            >
              <div
                class={`ag-paging-button ${
                  totalPage == 0 ? true : currentPage == 0 ? 'ag-disabled' : ''
                }`}
                onClick={firstPage}
              >
                <span
                  class="ag-icon ag-icon-first dark:text-white"
                  style={{
                    margin: pagination == 'compressed' ? 'inherit' : '0px 8px',
                  }}
                ></span>
                {/* <button type="button">First</button> */}
              </div>
              <div
                class={`ag-paging-button ${
                  totalPage == 0 ? true : currentPage == 0 ? 'ag-disabled' : ''
                }`}
                onClick={previousPage}
              >
                <span
                  class="ag-icon ag-icon-previous dark:text-white"
                  style={{
                    margin: pagination == 'compressed' ? 'inherit' : '0px 8px',
                  }}
                ></span>
                {/* <button type="button">Previous</button> */}
              </div>
              Page <span className="ml-1 mr-1">{currentPage + 1}</span> of{' '}
              <span className="ml-1 mr-1">{totalPage}</span>
              <div
                class={`ag-paging-button ${
                  totalPage == 0 ? true : currentPage >= totalPage - 1 ? 'ag-disabled' : ''
                }`}
                onClick={nextPage}
              >
                <span
                  class="ag-icon ag-icon-next dark:text-white"
                  style={{
                    margin: pagination == 'compressed' ? 'inherit' : '0px 8px',
                  }}
                ></span>
                {/* <button type="button">Next</button> */}
              </div>
              <div
                class={`ag-paging-button ${
                  totalPage == 0 ? true : currentPage >= totalPage - 1 ? 'ag-disabled' : ''
                }`}
                onClick={lastPage}
              >
                <span
                  class="ag-icon ag-icon-last dark:text-white"
                  style={{
                    margin: pagination == 'compressed' ? 'inherit' : '0px 8px',
                  }}
                ></span>
                {/* <button type="button">Last</button> */}
              </div>
            </span>
            <div>
              <span>
                <Tooltip title={'Refresh'}>
                  <span>
                    <Button
                      className="dark:text-white"
                      onClick={refreshGridPage}
                      icon={
                        isLoading ? (
                          <RotateRightRoundedIcon style={{ fontSize: '18px' }} />
                        ) : (
                          <RefreshRoundedIcon style={{ fontSize: '18px' }} />
                        )
                      }
                      style={{
                        margin: '0px',
                        background: 'none',
                        border: 'none',
                        top: '0px',
                        marginLeft: -5,
                        fontSize: '12px',
                      }}
                    ></Button>
                  </span>
                </Tooltip>
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
        {/* <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Pagination pages={this.getTotalPages(totalPage, currentPage + 1)} />
          </Grid>
          <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button
                style={{
                  marginTop: 20,
                  color: paginationDropDownColor[0],
                  border: '1px solid #C31D1D',
                }}
                // className="ant-btn-primary"
                ghost
              >
                {pageSize} <Icon type="down" />
              </Button>
            </Dropdown>
          </Grid>
        </Grid> */}
        <div>
          {/* <div style={{ height: "40px" }}>
            <div className="col-xs-11 col-sm-11 col-md-12 background-color-white"> */}

          {/* <Button
                className="grid-toolbar-refreshGrid-button paging-btn"
                disabled={totalPage == 0 ? true : currentPage == 0}
                onClick={firstPage}
                icon={'double-left'}
                style={{ margin: '5px' }}
              />
              <Button
                className="grid-toolbar-refreshGrid-button paging-btn"
                disabled={totalPage == 0 ? true : currentPage == 0}
                onClick={previousPage}
                icon={'left'}
                style={{ margin: '5px' }}
              />
              <label className="display_record pagebar-text">{'Page'} </label>
              <input
                key={Math.random()}
                defaultValue={totalPage == 0 ? 0 : currentPage + 1}
                disabled={totalPage == 0 ? true : false}
                type="number"
                pattern="[0-9]*"
                inputMode="numeric"
                className="paginator-text page-text"
                onBlur={onCustomPageNoChange}
                onKeyPress={onkeyPressEvent}
                min='0'
              />
              <label className="display_record pagebar-text">
                {' '}
                {' of '} {totalPage}{' '}
              </label>
              <Button
                className="grid-toolbar-refreshGrid-button paging-btn"
                disabled={totalPage == 0 ? true : currentPage >= totalPage - 1}
                onClick={nextPage}
                icon={'right'}
                style={{ margin: '5px' }}
              />
              <Button
                className="grid-toolbar-refreshGrid-button paging-btn"
                disabled={totalPage == 0 ? true : currentPage >= totalPage - 1}
                onClick={lastPage}
                icon={'double-right'}
                style={{ margin: '5px' }}
              />
              <Button
                className="grid-toolbar-refreshGrid-button paging-btn"
                onClick={refresh}
                icon={isLoading ? 'loading' : 'reload'}
                style={{ margin: '5px' }}
              >
                {' '}
                <i className={isLoading ? 'fa fa-spinner fa-spin' : 'fa fa-refresh'} />
              </Button> */}

          {/* <DropdownButton id='paging' style={{ minWidth: '35px' }} title={pageSize} dropup type="button" onSelect={onPageSizeChange} className="btn btn-w-m grid-toolbar-refreshGrid-button paging-btn" >
                {
                    paging.options.map(item => <MenuItem eventKey={item} key={item}>{item}</MenuItem>)
                }
            </DropdownButton> */}
          {/* <Dropdown overlay={menu}>
                <Button style={{ marginLeft: 8 }}>
                  {pageSize} <Icon type="down" />
                </Button>
              </Dropdown> */}

          {/* </div>
          </div> */}

          {/* <div className="clearfix" /> */}
        </div>
        {/*<div>
          <div>
             <br />
           <div className="col-xs-1 col-sm-1 col-md-4 background-color-white">
              {this.getPagingbar({
                totalRecords,
                currentPage,
                pageSize,
                title,
                totalPage,
              })}
            </div> 
          </div>
        </div>*/}
      </>
    );
  }
}
