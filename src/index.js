import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createMemoryHistory } from "history";
import configureStore from "./store_config";

import App from "./app";

const syncHistoryWithStore = (store, history) => {
  const { router } = store.getState();
  if (router && router.location) {
    history.replace(router.location);
  }
};

const initialState = {};
const routerHistory = createMemoryHistory();
console.log("RH", routerHistory);
const store = configureStore(initialState, routerHistory);
syncHistoryWithStore(store, routerHistory);

render(
  <Provider store={store}>
    <ConnectedRouter history={routerHistory}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
