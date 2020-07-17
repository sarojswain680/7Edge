import { combineReducers } from 'redux';
import Auth from './auth';
const initialState = { loadingStatus: false };

export default combineReducers({
    Auth,
});