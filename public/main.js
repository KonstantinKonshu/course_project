// const {
//   default: installExtension,
//   REACT_DEVELOPER_TOOLS,
//   REDUX_DEVTOOLS
// } = require("electron-devtools-installer");
const electron = require("electron");
const { ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
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

ipcMain.on("asynchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.reply("asynchronous-reply", "pong");
});

ipcMain.on("synchronous-message", (event, arg) => {
  console.log(arg); // prints "ping"
  event.returnValue = "pong";
});

// ipcMain.on("get-password", (event, user) => {
//   event.returnValue = keytar.getPassword("ServiceName", user);
// });

ipcMain.on("set-password", (event, user, pass) => {
  console.log("user", user);
  console.log("pass", pass);
  event.returnValue = require("keytar").setPassword("ServiceName", user, pass);
});

// app.whenReady().then(() => {
//   if (isDev)
//     installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
//       .then(name => console.log(`Added Extension: ${name}`))
//       .catch(err => console.log("An error occurred: ", err));
// });
