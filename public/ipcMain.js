const { app, ipcMain, dialog } = require("electron");
// const {getJob} = require('./job.js')
// const promiseLimit = require('promise-limit');
const path = require("path");
// const fsp = require('fs').promises;
const fs = require("fs");
const md5 = require("md5");
// const {CronTime} = require('cron');
const { getWindow } = require("./window.js");
const { isDirSync } = require("./helpers");
// const Store = require('electron-store');

// const limit = promiseLimit(5);
// const store = new Store();
module.exports = () => {
  ipcMain.handle("SELECT_DIRECTORY", event => {
    return dialog.showOpenDialogSync(getWindow("main"), {
      properties: ["openDirectory", "multiSelections"]
    });
  });

  ipcMain.on("CHECK_DIRECTORY", (event, folder_patch) => {
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
  });

  ipcMain.on("CHECK_PASSWORD", (event, user, pass) => {
    console.log("check_user", user);
    const hash_admin = md5(pass + "|admin");
    const hash_user = md5(pass + "|user");

    console.log("hash_admin", hash_admin);
    console.log("hash_user", hash_user);
    let role_user = "";
    require("keytar")
      .getPassword("course_project", user)
      .then(res => {
        console.log("res", res);
        if (res) {
          if (hash_admin === res) {
            console.log("1");
            role_user = "admin";
          } else {
            if (hash_user === res) {
              console.log("2");
              role_user = "user";
            } else role_user = "under";
          }
          console.log("role_user", role_user);
          return "nice";
        } else return require("keytar").getPassword("course_project", user);
      })
      .then(resp => {
        console.log("resp", resp);
        if (resp !== "nice") {
          if (md5(pass + "|admin") === resp) {
            console.log("a");
            role_user = "admin";
          } else {
            if (md5(pass + "|user") === resp) {
              console.log("b");
              role_user = "user";
            } else {
              console.log("c");
              role_user = "under";
            }
          }
        }
        event.returnValue = role_user;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("SET_ADMIN", (event, user, pass) => {
    console.log("user", user);
    console.log("pass", pass);
    console.log("pass-hash", md5(pass));
    event.returnValue = require("keytar").setPassword("course_project", user, md5(pass + "|admin"));
  });
};
