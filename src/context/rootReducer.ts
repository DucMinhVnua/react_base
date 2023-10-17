// rootReducer.js
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here if you have more slices
});

export default rootReducer;
