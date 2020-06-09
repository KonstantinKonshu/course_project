const { app, ipcMain, dialog } = require("electron");
// const default_avatar = require("./user_default_img.png");
// const {getJob} = require('./job.js')
// const promiseLimit = require('promise-limit');
const path = require("path");
// const fsp = require('fs').promises;
const fs = require("fs");
const md5 = require("md5");
// const {CronTime} = require('cron');
const { getWindow } = require("./window.js");
const { isDirSync, status_pwd } = require("./helpers");
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

  ipcMain.on("CHECK_PASSWORD", (event, user, hash_pass) => {
    console.log("check_user", user);
    // const hash_admin = md5(pass + "|admin");
    // const hash_user = md5(pass + "|user");

    // console.log("hash_admin", hash_admin);
    // console.log("hash_user", hash_user);
    let role_user = "";
    require("keytar")
      .getPassword("course_project", user)
      .then(res => {
        console.log("res", res);
        if (res) {
          if (hash_pass === res) {
            console.log("1");
            role_user = "admin";
          } else {
            if (hash_pass === res) {
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
          if (hash_pass === resp) {
            console.log("a");
            role_user = "admin";
          } else {
            if (hash_pass === resp) {
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

  ipcMain.on("GET_REG_USERS", event => {
    require("keytar")
      .findCredentials("course_project")
      .then(response => {
        console.log("GET_REG_USERS", response);
        const users = response.map(user => user.account);
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
    require("keytar")
      .getPassword("course_project", user_login)
      .then(getting_pwd => {
        console.log("CHANGE_PASSWORD:GETTING_PASSWORD", getting_pwd);
        role =
          old_hash_admin === getting_pwd ? "|admin" : old_hash_user === getting_pwd ? "|user" : undefined;
        if (role) {
          status_pwd(true);
          return require("keytar").setPassword("course_project", user_login, md5(new_password + role));
        } else {
          status_pwd(false);
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
    const hash_admin = md5(user_password + "|admin");
    const hash_user = md5(user_password + "|user");
    let hash_pwd;
    require("keytar")
      .getPassword("course_project", user_login)
      .then(res => {
        console.log("res", res);
        if (res) {
          if (hash_admin === res) {
            console.log("1--GET_HASH");
            hash_pwd = hash_admin;
          } else {
            if (hash_user === res) {
              console.log("2--GET_HASH");
              hash_pwd = hash_user;
            } else hash_pwd = user_password;
          }
          console.log("hash_pwd", hash_pwd);
          return "nice";
        } else return require("keytar").getPassword("course_project", user_login);
      })
      .then(resp => {
        console.log("resp", resp);
        if (resp !== "nice") {
          if (md5(user_password + "|admin") === resp) {
            console.log("a--GET_HASH");
            hash_pwd = hash_admin;
          } else {
            if (md5(user_password + "|user") === resp) {
              console.log("b--GET_HASH");
              hash_pwd = hash_user;
            } else {
              console.log("c--GET_HASH");
              hash_pwd = user_password;
            }
          }
        }
        event.returnValue = hash_pwd;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
};
