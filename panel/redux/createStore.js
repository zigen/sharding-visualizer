// @flow

import { createStore as _createStore, combineReducers } from "redux";
import reducers from "./modules";

const createStore = () => {
  return _createStore(
    combineReducers(reducers),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
};

export default createStore;
