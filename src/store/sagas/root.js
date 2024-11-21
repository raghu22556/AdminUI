import { takeLatest, all } from 'redux-saga/effects';
import { genericFunction, handleError } from './core';
import { ReduxHelper } from '../../core/redux-helper';

export default function* root() {
  var APIs = [takeLatest(ReduxHelper.ActionTypes.HANDLE_ERRORS_REQUEST, handleError)];
  var actionsTypes = ReduxHelper.ActionTypes;
  console.debug(actionsTypes);
  for (var key in actionsTypes.requestActions) {
    APIs.push(takeLatest(key, genericFunction));
  }
  yield all([...APIs]);
}
