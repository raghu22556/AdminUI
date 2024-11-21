import API from './requests';

const defaultActions = ['list', 'gridpreference'];

// Key is mapping for Page Section.
// actions are mapping for APIS
// if actions are not defined then default API is key.
// each action item has to be in camel case
// mostly controller is the key name.
export const CONFIG = [
  { key: 'Login', api: API.login },
  { key: 'CreateSuperAdmin', api: API.createSuperAdmin },
  { key: 'RecoverPassword', api: API.recoverPassword },
  { key: 'Combos', actions: [...defaultActions] },
  { key: 'Activity', actions: [...defaultActions] },
  { key: 'ActivityType', actions: [...defaultActions] },
  { key: 'AttachmentType', actions: [...defaultActions] },
  { key: 'City', actions: [...defaultActions] },
  { key: 'Product', actions: [...defaultActions] },
  { key: 'Menu', actions: [...defaultActions] },
  { key: 'Survey', actions: [...defaultActions] },
  { key: 'SurveyQuestion', actions: [...defaultActions] },
  { key: 'SurveyDetail', actions: [...defaultActions] },
  { key: 'SecurityModule', actions: [...defaultActions] },
  { key: 'Comment', actions: [...defaultActions] },
  { key: 'ControlRoomRequest', actions: [...defaultActions] },
  { key: 'ControlRoomRequestReply', actions: [...defaultActions] },
  { key: 'Logs', actions: [...defaultActions] },
  { key: 'Mobile', actions: ['RequestForJson', 'OperationRequest'] },
  { key: 'News', actions: [...defaultActions] },
  { key: 'ToDo', actions: [...defaultActions] },
  { key: 'User', actions: [...defaultActions] },
  { key: 'UserRole', actions: [...defaultActions] },
  { key: 'Videos', actions: [...defaultActions] },
  { key: 'VideoBatch', actions: ['RequestForAPI'], controller: 'Mobile' },
  { key: 'WellnessCenter', actions: [...defaultActions] },
  { key: 'WellnessCenterType', actions: [...defaultActions] },
  { key: 'Feedback', actions: [ 'insert'], controller: '10408'}
];

let dynamicConfig = JSON.parse(localStorage.getItem('dynamicConfig'));
let mapping = [];
if (null != dynamicConfig) {
  mapping = dynamicConfig.map((item) => {
    return { ...item, actions: [...defaultActions] };
  });
}
export const newConfig = mapping;
