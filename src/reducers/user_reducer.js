import { SET_USER } from "../constants";

const initialState = {
  login: null,
  hash_password: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        login: action.payload1,
        hash_password: action.payload2
      };
    // case types.HANDLE_SUBMIT_INIT:
    //     return {
    //         ...state,
    //         channelId: action.payload2,
    //         bannerChannel: action.payload2
    //     };
    // case types.get.GET_BANNER_CHANNELS:
    //     return {
    //         ...state,
    //         bannerChannel: action.payload
    //     }

    default:
      return state;
  }
}
