import { all, put, takeLatest, call } from 'redux-saga/effects';
import { ReduxHelper } from '../../core/redux-helper';
import API from '../requests';
import { useNavigate } from 'react-router-dom';

const ActionTypes = ReduxHelper.ActionTypes;

export function* genericFunction(action) {
  const { payload, successType, failureType } = action;
  try {
    var { api, controller } = action;
    if (payload.localGridPreferences) {
      yield put({
        type: successType,
        payload: payload.gridPreferences,
      });
    } else if (api) {
      const response = yield call(api, payload);
      yield put({
        type: successType,
        payload: response.data,
      });
    } else {
      const response = yield call(API.triggerPost, controller, payload);
      if (response.data.combos && Object.keys(response.data.combos).length > 0) {
        var filterCombos = {};
        var actionsTypes = ActionTypes;
        var combos = response.data.combos;
        for (var key in combos) {
          var combo = combos[key];
          if (combo) {
            var allSelected = new Map();
            var deSelected = new Map();
            for (var item of combo) {
              allSelected.set(item.LookupId, true);
              deSelected.set(item.LookupId, false);
            }
            filterCombos[key + '_select'] = allSelected;
            filterCombos[key + '_deselect'] = deSelected;
          }
        }
        yield put({
          type: actionsTypes.successActions.LIST_COMBOS_SUCCESS,
          payload: { ...combos, ...filterCombos },
        });
      }
      yield put({
        type: successType,
        payload: response.data,
      });
    }
  } catch (error) {
    yield put({
      type: ActionTypes.HANDLE_ERRORS_REQUEST,
      successType: successType,
      successAction: action,
      error: error,
      failureType: failureType,
    });
  }
}

export function* handleError(action) {
  const { error, successAction, failureType, successType } = action;
  if (error && error.response && error.response.status) {
    if (error.response.status == 401) {
      alert('UnAuthorized');
      const navigate = useNavigate();
      navigate('/');
      window.location.reload(true);
    } else if (error.response.status == 400 || error.response.status == 500) {
      yield put({
        type: failureType,
        error: error,
      });
    }
  } else if (error.code == 'ERR_NETWORK') {
    error.response = {
      data: {
        Message: error.message,
      },
    };
    delete error.message;
    yield put({
      type: failureType,
      error: error,
    });
  } else {
    yield put({
      type: successType,
      payload: [],
    });
  }
}

export const sagaGenerator = (actionReq) =>
  function* sagaFunc() {
    yield takeLatest(actionReq, genericFunction);
  };
