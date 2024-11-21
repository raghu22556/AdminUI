import React from 'react';
import { CircularProgress } from '@material-ui/core';
import API from '../../store/requests';
import { Modal } from 'antd';
const { confirm } = Modal;
const modal = Modal;

const getThemeColor = () => {
  return '';
};

export default {
  constructParams: function (query) {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
          var data = param.split('='),
            key = data[0],
            value = data[1];
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {})
      : {};
  },
};
const defaultGridColumns = () => [
  {
    dataIndex: 'CreatedBy',
    header: 'CreatedBy',
    type: 'combo',
    comboType: localStorage.userTable,
  },
  {
    dataIndex: 'CreatedDate',
    header: 'CreatedDate',
    type: 'date',
  },
  {
    dataIndex: 'ModifiedBy',
    header: 'ModifiedBy',
    type: 'combo',
    comboType: localStorage.userTable,
  },
  {
    dataIndex: 'ModifiedDate',
    header: 'ModifiedDate',
    type: 'date',
  },
];

const defaultLoader = () => {
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

const successAlert = (t) => {
  modal.destroyAll();
  modal.success({
    title: t('Record Saved Successfully') + '...',
    okButtonProps: {
      style: {
        backgroundColor: getThemeColor(),
        border: 'none',
        display: 'none',
      },
    },
  });
  setTimeout(() => {
    modal.destroyAll();
  }, 1000);
};

const showModal = (msg, type) => {
  modal.destroyAll();
  modal[type]({
    title: msg,
    okButtonProps: {
      style: { backgroundColor: '#c31d1d', border: 'none', display: 'none' },
    },
  });
  setTimeout(() => {
    modal.destroyAll();
  }, 2000);
};

const triggerAPI = ({
  t,
  controller,
  params,
  resSuccessCallBack,
  resFailureCallBack,
  resErrorCallBack,
  gridPanel,
  reloadGrid,
  successStateParams,
  failureStateParams,
  addProgressBar,
}) => {
  resErrorCallBack = resErrorCallBack || resFailureCallBack;
  successStateParams = successStateParams || {};
  failureStateParams = failureStateParams || {};

  if (addProgressBar) {
    gridPanel.setState({ displayLoader: true });
    successStateParams = { ...successStateParams, displayLoader: false };
    failureStateParams = { ...failureStateParams, displayLoader: false };
  }

  API.triggerPost(controller, params)
    .then((response) => {
      if (response.status === 200) {
        if (response.data.success) {
          successAlert(t);

          if (reloadGrid) {
            gridPanel.setState(
              {
                ...successStateParams,
                isRefresh: true,
              },
              () => {
                gridPanel.state.isRefresh = false;
              },
            );
          } else {
            if (successStateParams) {
              gridPanel.setState({
                ...successStateParams,
              });
            }
          }

          if (resSuccessCallBack) {
            resSuccessCallBack(response);
          }
        } else {
          showModal(response.data.error, 'error');

          gridPanel.setState({ ...failureStateParams });

          if (resFailureCallBack) {
            resFailureCallBack();
          }
        }
      }
    })
    .catch((err) => {
      showModal(err.message, 'error');

      gridPanel.setState({ ...failureStateParams });

      if (resErrorCallBack) {
        resErrorCallBack();
      }
    });
};

const toVariableCase = (string) => string.charAt(0).toLowerCase() + string.slice(1);

export { toVariableCase, defaultGridColumns, defaultLoader, triggerAPI };
