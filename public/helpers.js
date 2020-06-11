// const {app, Notification} = require('electron');
const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const open = require("open");
const notifier = require("node-notifier");
const Buffer = require("buffer").Buffer;
const { setPassword, getPassword, findCredentials } = require("keytar");

const isDirSync = Path => {
  try {
    return fs.statSync(Path).isDirectory();
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    } else {
      throw e;
    }
  }
};

const encode_base64 = path_file => {
  fs.readFileSync(path_file, function(error, data) {
    if (error) {
      throw error;
    } else {
      const buf = Buffer.from(data);
      const img_base64 = buf.toString("base64");
      //console.log('Base64 of ddr.jpg :' + base64);
      return img_base64;
    }
  });
};

const decode_base64 = (base64str, path_file) => {
  const buf = Buffer.from(base64str, "base64");

  fs.writeFileSync(path_file, buf, function(error) {
    if (error) {
      throw error;
    } else {
      console.log("File created from base64 string!");
      return true;
    }
  });
};

const pwdStatus = status => {
  const icon_name = status ? "status_success.ico" : "status_error.ico";
  const title = status
    ? "Your password has been successfully changed!"
    : "Your password hasn't been successfully changed";
  notifier.notify({
    title: "Course project",
    message: title,
    icon: path.join(__dirname, icon_name),
    sound: true,
    timeout: 5
  });
};

const getRole = (user, user_password) => {
  // let role_user = "";
  getPassword("course_project", user)
    .then(resp => {
      // console.log("GET_ROLE", resp);
      if (md5(user_password + "|admin") === resp) {
        console.log("a");
        return "admin";
      } else {
        if (md5(user_password + "|user") === resp) {
          console.log("b");
          return "user";
        } else {
          console.log("c");
          return "";
        }
      }
      // console.log("ROLE", role_user);
      // return role_user;
    })
    .catch(function(err) {
      console.log(err);
    });
};

const getHash = (user_login, user_password) => {
  let hash = "";
  getPassword("course_project", user_login)
    .then(resp => {
      console.log("GETHASH", resp);
      if (md5(user_password + "|admin") === resp) {
        console.log("a--GET_HASH");
        hash = md5(user_password + "|admin");
      } else {
        if (md5(user_password + "|user") === resp) {
          console.log("b--GET_HASH");
          hash = md5(user_password + "|user");
        } else {
          console.log("c--GET_HASH");
          hash = user_password;
        }
      }
      return hash;
    })
    .catch(function(err) {
      console.log(err);
    });
};

const openSelectFile = path_file => {
  return async dispatch => {
    try {
      console.log("7777");
      const dir = await open(path_file, { wait: true });
      console.log(dir);
      // dispatch(setDirectory(dir ? dir : null));
    } catch (e) {
      console.error("678", e);
      // dispatch(setDirectory(null));
    }
  };
};

// const crypto = require("crypto");
//
// // Defining key
// const key = crypto.randomBytes(32);
//
// // Defining iv
// const iv = crypto.randomBytes(16);
//
// function encrypt(text) {
//   let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
//
//   let encrypted = cipher.update(text);
//
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//
//   return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
// }
//
// function decrypt(text) {
//   let iv = Buffer.from(text.iv, "hex");
//   let encryptedText = Buffer.from(text.encryptedData, "hex");
//
//   let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
//
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//
//   return decrypted.toString();
// }

module.exports = {
  isDirSync,
  encode_base64,
  decode_base64,
  pwdStatus,
  getRole,
  getHash,
  openSelectFile
  // encrypt,
  // decrypt
};
