
import { combineReducers } from '@reduxjs/toolkit';
import linksReducer from './reducers/links.reducer';

const rootReducer = combineReducers({
    minks: linksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;