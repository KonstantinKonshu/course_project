const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const crypto = require("crypto");
const notifier = require("node-notifier");
const { getPassword } = require("keytar");
const CryptoJS = require("crypto-js");

const encryptionKey = CryptoJS.enc.Utf8.parse("A%D*G-KaPdRgUkXp2s5v8y/B?E(H+MbQ");

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
  getPassword("course_project", user)
    .then(resp => {
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

const encryptionJSON = data => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey, {
    mode: CryptoJS.mode.ECB,
    keySize: 256
  }).toString();
};

const decryptionJSON = data => {
  const bytes = CryptoJS.AES.decrypt(data, encryptionKey, {
    mode: CryptoJS.mode.ECB,
    keySize: 256
  });
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
module.exports = {
  isDirSync,
  pwdStatus,
  getRole,
  getHash,
  encryptionKey
};
