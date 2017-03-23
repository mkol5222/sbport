import { combineReducers } from 'redux';
import FileList from './file_list';

const rootReducer = combineReducers({
  files: FileList,
});

export default rootReducer;