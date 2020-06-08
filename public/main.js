// const {
//   default: installExtension,
//   REACT_DEVELOPER_TOOLS,
//   REDUX_DEVTOOLS
// } = require("electron-devtools-installer");
// import { isDirSync } from "../src/helpers";
const { isDirSync } = require("./helpers");
const fs = require("fs");
// import {folderPath} from "../src/constants";

const electron = require("electron");
const { ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const md5 = require("md5");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// ipcMain.on("asynchronous-message", (event, arg) => {
//   console.log(arg); // prints "ping"
//   event.reply("asynchronous-reply", "pong");
// });
//
// ipcMain.on("synchronous-message", (event, arg) => {
//   console.log(arg); // prints "ping"
//   event.returnValue = "pong";
// });
ipcMain.on("check_directory", (event, folder_patch) => {
  console.log("folder_patch", folder_patch);
  if (!isDirSync(folder_patch)) {
    console.log("TR");
    // this.setState({ is_empty_dir: true });
    // fs.mkdirSync(folder_patch);
    event.returnValue = true;
  } else {
    console.log("FL");
    event.returnValue = false;
  }

  // event.returnValue = require("keytar").getPassword("course_project", user);
});

ipcMain.on("check-password", (event, user, pass) => {
  console.log("check_user", user);
  const hash_admin = md5(pass + "|admin");
  const hash_user = md5(pass + "|user");

  console.log("hash_admin", hash_admin);
  console.log("hash_user", hash_user);
  // const hash_pwd = require("keytar").getPassword("course_project", user);
  // let role_user = "";
  require("keytar")
    .getPassword("course_project", user)
    .then(res => {
      console.log("res", res);
      if (res) {
        if (hash_admin === res) {
          console.log("1");
          event.returnValue = "admin";
        } else {
          if (hash_user === res) {
            console.log("2");
            event.returnValue = "user";
          } else event.returnValue = "und";
        }
      } else return require("keytar").getPassword("course_project", user);
    })
    .then(resp => {
      console.log("resp", resp);
      if (md5(pass + "|admin") === resp) {
        console.log("a");
        event.returnValue = "admin";
      } else {
        if (md5(pass + "|user") === resp) {
          console.log("b");
          event.returnValue = "user";
        } else {
          console.log("c");
          event.returnValue = "under";
        }
      }
    })
    .catch(function(err) {
      console.log(err);
    });

  // console.log("role_user", role_user);
  // console.log("hash_pwd", hash_pwd);
  // console.log("hash_2", hash_2);

  // if (md5(pass + "|admin") === hash_pwd) event.returnValue = "admin";
  //
  // if (md5(pass + "|user") === hash_pwd) event.returnValue = "user";
  // event.returnValue = role_user;
});

ipcMain.on("set-password-admin", (event, user, pass) => {
  console.log("user", user);
  console.log("pass", pass);
  console.log("pass-hash", md5(pass));

  event.returnValue = require("keytar").setPassword("course_project", user, md5(pass + "|admin"));
});
