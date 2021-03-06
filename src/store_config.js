import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter } from "connected-react-router";
import userReducer from "./reducers/user_reducer";
import file_reducer from "./reducers/file_reducer";

export default function configureStore(initialState, routerHistory) {
  const rootReducer = combineReducers({
    router: connectRouter(routerHistory),
    user: userReducer,
    file: file_reducer
  });

  const composeEnhancers =
    (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancer = composeEnhancers(applyMiddleware(thunk));

  return createStore(rootReducer, initialState, enhancer);
}
