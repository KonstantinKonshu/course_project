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
  // ipcRenderer.sendSync("SET_DIRECTORY", dir);
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

export function addFile() {
  return async dispatch => {
    try {
      console.log("9999");
      const dir = await ipcRenderer.invoke("ADD_FILES");
      console.log(dir);
      // dispatch(setDirectory(dir ? dir : null));
    } catch (e) {
      console.error(e);
      // dispatch(setDirectory(null));
    }
  };
}

export function openFile(file_name) {
  return async dispatch => {
    try {
      console.log("6666");
      const dir = await ipcRenderer.invoke("OPEN_FILE", file_name);
      console.log(dir);
      // dispatch(setDirectory(dir ? dir : null));
    } catch (e) {
      console.error(e);
      // dispatch(setDirectory(null));
    }
  };
}
