import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter } from "connected-react-router";

export default function configureStore(initialState, routerHistory) {
  const rootReducer = combineReducers({
    router: connectRouter(routerHistory)
  });

  const composeEnhancers =
    (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancer = composeEnhancers(applyMiddleware(thunk));

  return createStore(rootReducer, initialState, enhancer);
}
