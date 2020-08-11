import { SET_DIRECTORY } from "../constants";

const initialState = {
  selectedDirectory: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_DIRECTORY:
      return {
        ...state,
        selectedDirectory: action.payload
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
