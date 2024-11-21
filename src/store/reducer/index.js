import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { ReduxHelper } from '../../core/redux-helper';
import Combo from './combo';
import customizationReducer from '../reducers/customizationReducer'
import canvasReducer from '../reducers/canvasReducer'
import notifierReducer from '../reducers/notifierReducer'
import dialogReducer from '../reducers/dialogReducer'

const rootReducer = (asyncReducers) => {
  return combineReducers({
    customization: customizationReducer,
    canvas: canvasReducer,
    notifier: notifierReducer,
    dialog: dialogReducer,
    form: formReducer,
    combos: Combo,
    ...ReduxHelper.Reducers,
    ...asyncReducers,
  });
};

export default rootReducer;
