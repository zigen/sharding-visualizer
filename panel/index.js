// @flow
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import createStore from "./redux/createStore";

const store = createStore();
const initInformationPanel = element => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    element
  );
  return store;
};

export { initInformationPanel };
