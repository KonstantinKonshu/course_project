import { types } from "../constants";

const { ipcRenderer } = require("electron");

export const setUser = (user_name, password) => {
  return {
    type: types.SET_USER,
    payload1: user_name,
    // payload2: password
    payload2: password //ipcRenderer.sendSync("GET_HASH", user_name, password)
  };
};

export function setDirectory(dir) {
  return {
    type: types.SET_DIRECTORY,
    payload: dir
  };
}

export function selectDirectory() {
  return async dispatch => {
    try {
      const dir = await ipcRenderer.invoke("SELECT_DIRECTORY");
      dispatch(setDirectory(dir ? dir : null));
    } catch (e) {
      console.error(e);
      dispatch(setDirectory(null));
    }
  };
}
// export const selectDirectories = data => {
//
//   return async dispatch => {
//     try {
//       const dirs = await myIpcRenderer.invoke('APP_SELECT_DIRECTORIES');
//       dispatch(setDirectories(dirs ? dirs : null));
//     } catch (e) {
//       console.error(e);
//       dispatch(setDirectories(null));
//     }
//   };
//     return{
//         type: types.get.GET_REQUEST_SEARCH,
//         payload: data
//     }
// }

// export const getBannerChannels = bannerChannel =>{
//     return{
//         type: types.get.GET_BANNER_CHANNELS,
//         payload: bannerChannel
//     }
// }
//
// export const handleClickVideo = videoSelect => {
//     return{
//         type: types.set.SET_SELECT_VIDEO,
//         payload: videoSelect
//
//     }
// }
//
// export const handleClickChannel = channel =>{
//     return{
//         type: types.SELECT_CHANNEL,
//         payload: channel
//     }
// }
//
// export const setError = error => {
//     return{
//         type: types.set.SET_ERROR,
//         payload: error
//     }
// }
