const { app, ipcMain, dialog } = require("electron");
// const default_avatar = require("./user_default_img.png");
// const {getJob} = require('./job.js')
// const promiseLimit = require('promise-limit');
const path = require("path");
// const fsp = require('fs').promises;
const fs = require("fs");
const md5 = require("md5");
const { setPassword, getPassword, findCredentials } = require("keytar");
// const {CronTime} = require('cron');
const { getWindow } = require("./window.js");
const { isDirSync, pwdStatus, getRole, getHash } = require("./helpers");
const Store = require("electron-store");

// const limit = promiseLimit(5);
const store = new Store();
module.exports = () => {
  ipcMain.handle("SELECT_DIRECTORY", event => {
    return dialog.showOpenDialogSync(getWindow("main"), {
      properties: ["openDirectory"]
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

  ipcMain.on("GET_ROLE", (event, user, pass) => {
    console.log("ipc GET_ROLE", { user, pass });
    // const result = getRole(user, pass);
    // console.log("09876543", result);
    // event.returnValue = result;
    getPassword("course_project", user)
      .then(resp => {
        // console.log("GET_ROLE", resp);
        if (md5(pass + "|admin") === resp) {
          console.log("a");
          event.returnValue = "admin";
        } else {
          if (md5(pass + "|user") === resp) {
            console.log("b");
            event.returnValue = "user";
          } else {
            console.log("c");
            event.returnValue = "";
          }
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("CHECK_AUTH_USER", (event, user_login, user_password) => {
    getPassword("course_project", user_login)
      .then(resp => {
        console.log("checkPassword", resp);

        event.returnValue = md5(user_password + "|admin") === resp || md5(user_password + "|user") === resp;
      })
      .catch(function(err) {
        console.log(err);
      });
    // event.returnValue = result;
  });

  ipcMain.on("GET_REG_USERS", event => {
    findCredentials("course_project")
      .then(response => {
        console.log("GET_REG_USERS", response);
        const users = response.map(user => user.account);
        console.log("USERS", users);
        event.returnValue = users;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("GET_AVATAR_USER", (event, user_login) => {
    const avatar = store.get(`users.${user_login}.avatar`);
    if (!avatar) {
      // fs.readFileSync('./your-image.png', 'base64')
      const file_data = fs.readFileSync(path.resolve(__dirname, "user_default_img.png"), "base64");
      // console.log("GET_AVATAR_USER", file_data);
      // let img_path = path.resolve(__dirname, "user_default_img.png");
      // var file = element.files[0];
      // let reader = new FileReader();
      // reader.onloadend = function() {
      //   console.log("RESULT", reader.result);
      event.returnValue = file_data;
      // };
      // reader.readAsDataURL("./user_default_img.png");
      // store.set(`users.${user_login}.avatar`, );
    } else {
      // event.ret;
    }
  });

  ipcMain.on("CHANGE_PASSWORD", (event, user_login, new_password, old_password) => {
    const old_hash_admin = md5(old_password + "|admin");
    const old_hash_user = md5(old_password + "|user");
    console.log("old_hash_admin", old_hash_admin);
    console.log("old_hash_user", old_hash_user);
    let role;
    console.log("new_hash_admin", md5(new_password + "|admin"));
    console.log("new_hash_user", md5(new_password + "|user"));
    getPassword("course_project", user_login)
      .then(getting_pwd => {
        console.log("CHANGE_PASSWORD:GETTING_PASSWORD", getting_pwd);
        role =
          old_hash_admin === getting_pwd ? "|admin" : old_hash_user === getting_pwd ? "|user" : undefined;
        if (role) {
          pwdStatus(true);
          return setPassword("course_project", user_login, md5(new_password + role));
        } else {
          pwdStatus(false);
          event.returnValue = false;
        }
      })
      .then(() => {
        event.returnValue = true;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("GET_HASH", (event, user_login, user_password) => {
    console.log("ipc HASH", { user_login, user_password });
    const result = getHash(user_login, user_password);
    event.returnValue = result;
    // event.reply("GETTING_HASH", result);
  });
};
