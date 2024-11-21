import { ActionTypes } from '../';

// Custom Actions
const login = (payload) => {
  return {
    type: ActionTypes.LOGIN_REQUEST,
    payload: payload,
  };
};

export { login };
