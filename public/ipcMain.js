const { app, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const md5 = require("md5");
const open = require("open");
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const { embed, digUp } = require("@mykeels/steganography");
const tmp = require("tmp");
const { setPassword, getPassword, findCredentials } = require("keytar");
const { getWindow } = require("./window.js");
const { isDirSync, pwdStatus, getHash, encryptionKey } = require("./helpers");
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

    // embed(path.resolve(__dirname, "user_default_img.png"), md5(crypto.randomBytes(32)), cr_key)
    //   .then(res => {
    //     fs.writeFileSync(path.join(store.get("directory"), "output.png"), res);
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
    return store.get("directory");
  });

  ipcMain.on("CHECK_DIRECTORY", event => {
    console.log("folder_patch", store.get("directory"));
    if (store.get("directory")) {
      if (!isDirSync(store.get("directory"))) {
        console.log("TR");

        store.delete("directory");
        event.returnValue = true;
      } else {
        console.log("FL");
        event.returnValue = false;
      }
    } else event.returnValue = true;
  });

  ipcMain.on("GET_ROLE", (event, user_login, user_password) => {
    console.log("ipc GET_ROLE", { user_login, user_password });

    getPassword("course_project", user_login)
      .then(resp => {
        if (md5(user_password + "|admin") === resp) {
          console.log("a");

          store.set("current_user", {
            login: user_login,
            password: md5(user_password + "|admin"),
            role: "admin"
          });

          console.log("STORE__", app.getPath("userData"));
          event.returnValue = true;
        } else {
          if (md5(user_password + "|user") === resp) {
            console.log("b");
            store.set("current_user", {
              login: user_login,
              password: md5(user_password + "|user"),
              role: "user"
            });
            event.returnValue = false;
          } else {
            console.log("c");
            throw new Error("o_O");
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

    // if (!store.get("iv") && !store.get("key")) {
    //   store.set("key", crypto.randomBytes(32));
    //   store.set("iv", crypto.randomBytes(16));
    // }
    // const iv = store.get("iv");
    // const key = store.get("key");

    if (!avatar) {
      // fs.readFileSync('./your-image.png', 'base64')
      // console.log("BUFF---12");

      //спрятать

      // embed(path.resolve(__dirname, "user_default_img.png"), `Hello_world`, "YOUR_PASSWORD_HERE")
      //   .then(res => {
      //     fs.writeFileSync(path.join(__dirname, "user_default_img.png"), res);
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });

      //раскрыть

      // digUp(path.join(__dirname, "user_default_img.png"), "YOUR_PASSWORD_HERE")
      //   .then(r => {
      //     console.log("text", r);
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });

      // const file_data = fs.readFileSync(path.resolve(__dirname, "user_default_img.png"), "base64");

      embed(path.resolve(__dirname, "user_default_img.png"), md5(crypto.randomBytes(32)), encryptionKey)
        .then(res => {
          const ciphertext = CryptoJS.AES.encrypt(res, encryptionKey).toString("base64");
          // console.log("rereres", res);
          // console.log("cipher", ciphertext);
          // fs.writeFileSync(
          //   path.join(store.get("directory"), `${user_login}_folder`, `${user_login}_avatar.png`),
          //   res
          // );
          //
          // const file_data = fs.readFileSync(
          //   path.join(store.get("directory"), `${user_login}_folder`, `${user_login}_avatar.png`),
          //   "base64"
          // );
          event.returnValue = file_data;
        })
        .catch(function(err) {
          console.log(err);
        });

      // try {
      //   console.log("9999");
      //   const buffer =  embed(
      //       file_path,
      //       `This is my message to the world. Love, Joy and Happiness!`,
      //       "YOUR_PASSWORD_HERE"
      //   );
      //
      //   fs.writeFileSync(path.join(__dirname, "./path/to/output.png"), buffer);
      //   console.log(buffer);
      // } catch (e) {
      //   console.error(e);
      // }}

      // console.log("GET_AVATAR_USER", file_data);
      // let img_path = path.resolve(__dirname, "user_default_img.png");
      // var file = element.files[0];
      // let reader = new FileReader();
      // reader.onloadend = function() {
      //   console.log("RESULT", reader.result);

      // };
      // reader.readAsDataURL("./user_default_img.png");
      // store.set(`users.${user_login}.avatar`, );
    } else {
      event.returnValue = avatar;
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
        if (!store.get(`users.${user_login}.key`) && !store.get(`users.${user_login}.iv`)) {
          store.set(`users.${user_login}.key`, crypto.randomBytes(32));
          store.set(`users.${user_login}.iv`, crypto.randomBytes(16));
        }
        console.log("store.key", store.get(`users.${user_login}.key`));
        console.log("store.iv", store.get(`users.${user_login}.iv`));
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

  ipcMain.on("GET_USER_FILES", (event, selected_user = undefined) => {
    const user = store.get("current_user");
    console.log("SSSSSS_User", selected_user);
    let user_folder;
    if (user.role === "admin") {
      if (!selected_user) event.returnValue = [];
      else user_folder = selected_user;
    } else user_folder = user.login;

    // const user_folder = user.role === "admin" ? selected_user ? selected_user  : user.login;

    console.log("USERUSER", user);

    if (store.get("directory") && user) {
      if (!isDirSync(path.join(store.get("directory"), `${user_folder}_folder`))) {
        console.log("NO_directory");
        //директории нет

        event.returnValue = [];
      } else {
        //директория есть
        console.log("YES_directory");
        const files = fs.readdirSync(path.join(store.get("directory"), `${user_folder}_folder`));
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
      const key = Buffer.from(store.get(`users.${user.login}.key`));
      const iv = Buffer.from(store.get(`users.${user.login}.iv`));
      // console.log("key", key);
      // console.log("iv", iv);
      // const key = crypto.randomBytes(32);
      // const iv = crypto.randomBytes(16);
      console.log("key", key);
      console.log("iv", iv);

      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      fs.createReadStream(selected_file[0])
        .pipe(cipher)
        .pipe(
          fs.createWriteStream(
            path.join(store.get("directory"), `${user.login}_folder`, path.basename(selected_file[0]))
          )
        );
      // fs.createReadStream(selected_file[0]).pipe(
      //   fs.createWriteStream(
      //     path.join(store.get("directory"), `${user.login}_folder`, path.basename(selected_file[0]))
      //   )
      // );
      event.returnValue = true;
    } else event.returnValue = undefined;
  });

  ipcMain.handle("OPEN_FILE", (event, file_name, selected_user = undefined) => {
    const user = store.get("current_user");
    let user_folder;
    if (user.role === "admin") {
      if (!selected_user) event.returnValue = [];
      else user_folder = selected_user;
    } else user_folder = user.login;

    if (store.get("directory") && user) {
      tmp.file(function _tempFileCreated(err, path1, fd, cleanupCallback) {
        if (err) throw err;

        console.log("File: ", path1);
        console.log("Filedescriptor: ", fd);

        const key = Buffer.from(store.get(`users.${user_folder}.key`));
        const iv = Buffer.from(store.get(`users.${user_folder}.iv`));
        console.log("key", key);
        console.log("iv", iv);

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

        fs.createReadStream(path.join(store.get("directory"), `${user_folder}_folder`, file_name))
          .pipe(decipher)
          .pipe(fs.createWriteStream(path1));

        // fs.createReadStream(path.join(store.get("directory"), `${user_folder}_folder`, file_name)).pipe(
        //   fs.createWriteStream(path1)
        // );

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

  ipcMain.handle("CHANGE_AVATAR", event => {
    console.log("CHANGE_AVATAR");
    const select_avatar = dialog.showOpenDialogSync(getWindow("main"), {
      properties: ["openFile"],
      filters: [
        {
          name: "avatars",
          extensions: "png|jpeg".split("|")
        }
      ]
    });
    console.log("SELECTED_IMG", select_avatar);

    // store.set("current_user", {
    //   login: user_login,
    //   password: md5(user_password + "|admin"),
    //   role: "admin"
    // });

    // embed(path.resolve(__dirname, "user_default_img.png"), md5(crypto.randomBytes(32)), cr_key)
    //   .then(res => {
    //     fs.writeFileSync(path.join(store.get("directory"), "output.png"), res);
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });

    const user = store.get("current_user");
    if (store.get("directory")) {
      if (!isDirSync(path.join(store.get("directory"), `${user.login}_folder`))) {
        console.log("NO_directory");
        //директории нет
        fs.mkdirSync(path.join(store.get("directory"), `${user.login}_folder`));
      }

      const selected_avatar = dialog.showOpenDialogSync(getWindow("main"), {
        properties: ["openFile"],
        filters: [
          {
            name: "avatars",
            extensions: "png|jpeg".split("|")
          }
        ]
      });
      console.log("SELECTED_IMG", select_avatar);

      const key = Buffer.from(store.get(`users.${user.login}.key`));
      const iv = Buffer.from(store.get(`users.${user.login}.iv`));
      // console.log("key", key);
      // console.log("iv", iv);
      // const key = crypto.randomBytes(32);
      // const iv = crypto.randomBytes(16);
      console.log("key", key);
      console.log("iv", iv);

      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      fs.createReadStream(selected_avatar[0])
        .pipe(cipher)
        .pipe(
          fs.createWriteStream(
            path.join(store.get("directory"), `${user.login}_folder`, path.basename(selected_avatar[0]))
          )
        );
      event.returnValue = true;
    } else event.returnValue = undefined;
  });

  ipcMain.on("EXIT", event => {
    store.delete("current_user");
    event.returnValue = true;
  });
};
