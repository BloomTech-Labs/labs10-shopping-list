import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

// Router
import { BrowserRouter as Router } from "react-router-dom";

// Redux
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import * as serviceWorker from "./serviceWorker";

import rootReducer from "./store/reducers/";

// Redux dev tools
const store = createStore(rootReducer, compose(applyMiddleware(thunk, logger)));

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
