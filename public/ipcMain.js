const { app, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const md5 = require("md5");
const open = require("open");
const crypto = require("crypto");
// const temp = require("fs-temp");
const tmp = require("tmp");
const { setPassword, getPassword, findCredentials } = require("keytar");
const { getWindow } = require("./window.js");
const { isDirSync, pwdStatus, getRole, getHash, openSelectFile } = require("./helpers");
const Store = require("electron-store");

const store = new Store();
module.exports = () => {
  ipcMain.handle("SELECT_DIRECTORY", event => {
    const directorySpace = dialog.showOpenDialogSync(getWindow("main"), {
      properties: ["openDirectory"]
    });
    fs.mkdirSync(path.join(directorySpace[0], "File_store"));
    store.set("directory", path.join(directorySpace[0], "File_store"));
    console.log("DIR", store.get("directory"));
    return store.get("directory");
  });

  // ipcMain.on("SET_DIRECTORY", (event, dir) => {
  //   store.set("directory", dir);
  // });

  ipcMain.on("CHECK_DIRECTORY", event => {
    console.log("folder_patch", store.get("directory"));
    if (store.get("directory")) {
      if (!isDirSync(store.get("directory"))) {
        console.log("TR");

        store.delete("directory");
        // this.setState({ is_empty_dir: true });
        // fs.mkdirSync(folder_patch);
        event.returnValue = true;
      } else {
        console.log("FL");
        event.returnValue = false;
      }
    } else event.returnValue = true;
  });

  ipcMain.on("GET_ROLE", (event, user_login, user_password) => {
    console.log("ipc GET_ROLE", { user_login, user_password });
    // const result = getRole(user, pass);
    // console.log("09876543", result);
    // event.returnValue = result;
    getPassword("course_project", user_login)
      .then(resp => {
        // console.log("GET_ROLE", resp);
        if (md5(user_password + "|admin") === resp) {
          console.log("a");
          store.set("current_user", { login: user_login, password: md5(user_password + "|admin") });
          event.returnValue = "admin";
        } else {
          if (md5(user_password + "|user") === resp) {
            console.log("b");
            store.set("current_user", { login: user_login, password: md5(user_password + "|user") });
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

  ipcMain.on("CHECK_AUTH_USER", (event, user_login, user_password, is_empty_dir) => {
    getPassword("course_project", user_login)
      .then(resp => {
        console.log("checkPassword", resp);
        if (is_empty_dir) {
          event.returnValue = md5(user_password + "|admin") === resp;
        } else {
          event.returnValue = md5(user_password + "|admin") === resp || md5(user_password + "|user") === resp;
        }
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

  ipcMain.on("GET_EYE", event => {
    const img_eye = fs.readFileSync(path.resolve(__dirname, "eye_visible.ico"), "base64");
    event.returnValue = img_eye;
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
          console.log("1", store.get("current_user"));
          store.set("current_user.password", md5(new_password + role));
          console.log("2", store.get("current_user"));
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

  ipcMain.on("CHECK_USER_EXIST", (event, user_login) => {
    console.log("CHECK_USER_EXIST", user_login);
    findCredentials("course_project")
      .then(response => {
        const user = response.filter(user => user.account === user_login);
        if (user.length) {
          console.log("CHECK_USER_EXIST--len", user.length);
          event.returnValue = true;
        } else {
          event.returnValue = false;
          // if (user !== []) event.returnValue = true;
          // else event.returnValue = false;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("REGISTRATION_USER", (event, user_login, user_password, is_empty_dir) => {
    let hash_pwd;
    if (is_empty_dir) hash_pwd = md5(user_password + "|admin");
    else hash_pwd = md5(user_password + "|user");

    setPassword("course_project", user_login, hash_pwd)
      .then(() => {
        event.returnValue = true;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("CHECK_REG_USERS", event => {
    findCredentials("course_project")
      .then(response => {
        console.log("CHECK_REG_USERS", response);
        const users = response.map(user => user.account);
        if (users.length) {
          console.log("CHECK_REG_USERS--len", users.length);
          event.returnValue = true;
        } else {
          event.returnValue = false;
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  ipcMain.on("GET_USER_FILES", event => {
    const user = store.get("current_user");

    console.log("USERUSER", user);
    // fs.readdirSync(path.join("")).forEach(file => {
    //   console.log(file);
    // });

    if (store.get("directory") && user) {
      if (!isDirSync(path.join(store.get("directory"), `${user.login}_folder`))) {
        console.log("NO_directory");
        //директории нет

        event.returnValue = [];
      } else {
        //директория есть
        console.log("YES_directory");
        const files = fs.readdirSync(path.join(store.get("directory"), `${user.login}_folder`));
        console.log("FILES", files);
        event.returnValue = files;
        // event.returnValue = undefined;
      }
    } else event.returnValue = [];
  });

  ipcMain.handle("ADD_FILES", event => {
    const user = store.get("current_user");
    if (store.get("directory")) {
      if (!isDirSync(path.join(store.get("directory"), `${user.login}_folder`))) {
        console.log("NO_directory");
        //директории нет
        fs.mkdirSync(path.join(store.get("directory"), `${user.login}_folder`));
      }

      const selected_file = dialog.showOpenDialogSync(getWindow("main"), {
        properties: ["openDirectory", "openFile"]
      });
      console.log("select_file", selected_file);
      // let iv, key;
      // if (!store.get("iv") && !store.get("key")) {
      //   store.set("key", crypto.randomBytes(32));
      //   store.set("iv", crypto.randomBytes(16));
      // }
      // const iv = store.get("iv");
      // const key = store.get("key");

      // const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv));
      // fs.createReadStream(selected_file[0])
      //   .pipe(cipher)
      //   .pipe(
      //     fs.createWriteStream(
      //       path.join(store.get("directory"), `${user.login}_folder`, path.basename(selected_file[0]))
      //     )
      //   );
      store.delete("key");
      store.delete("iv");

      fs.createReadStream(selected_file[0]).pipe(
        fs.createWriteStream(
          path.join(store.get("directory"), `${user.login}_folder`, path.basename(selected_file[0]))
        )
      );
      event.returnValue = true;
    } else event.returnValue = undefined;
  });

  ipcMain.handle("OPEN_FILE", (event, file_name) => {
    const user = store.get("current_user");

    if (store.get("directory") && user) {
      tmp.file(function _tempFileCreated(err, path1, fd, cleanupCallback) {
        if (err) throw err;

        console.log("File: ", path1);
        console.log("Filedescriptor: ", fd);

        const iv = store.get("iv");
        const key = store.get("key");
        console.log("key", key);
        console.log("iv", iv);

        // const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), Buffer.from(iv));

        // fs.createReadStream(path.join(store.get("directory"), `${user.login}_folder`, file_name))
        //   .pipe(decipher)
        //   .pipe(fs.createWriteStream(path1));

        fs.createReadStream(path.join(store.get("directory"), `${user.login}_folder`, file_name)).pipe(
          fs.createWriteStream(path1)
        );

        open(path1);
        // openSelectFile(path1);
        // open(path1, {
        //   wait: true
        // }).catch(function(err) {
        //   console.log("1234  ", err);
        // });

        // cleanupCallback();
      });
    }
    event.returnValue = false;
  });

  ipcMain.on("EXIT", event => {
    store.delete("current_user");
    event.returnValue = true;
  });
};
