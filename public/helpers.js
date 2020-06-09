// const {app, Notification} = require('electron');
const fs = require("fs");
const path = require("path");
const notifier = require("node-notifier");
const Buffer = require("buffer").Buffer;

// const async = require('async');
// const hasha = require('hasha');
// const CryptoJS = require("crypto-js");
// const xl = require('excel4node');
// const promiseLimit = require('promise-limit');
// const {encryptionKey} = require('./config');
// const Store = require('electron-store');

// const store = new Store();
//
// const saveAnalysis = (paths, pathToSave, firstSnapshot, secondSnapshot) => {
//     let wb = new xl.Workbook({
//         defaultFont: { color: '#000000', size: 12 }
//     });
//     let ws = wb.addWorksheet('Analysis')
//     ws.cell(1, 1).string('Path')
//     ws.cell(1, 2).string('Hash value[1]')
//     ws.cell(1, 3).string('Hash value[2]')
//     ws.cell(1, 4).string('Result comparison')
//     ws.column(1).setWidth(50)
//     ws.column(2).setWidth(50)
//     ws.column(3).setWidth(50)
//     ws.column(4).setWidth(50)
//     paths.forEach((path, index) => {
//         const isEqual = firstSnapshot[path] === secondSnapshot[path]
//         ws.cell(index + 2, 1).string(path)
//         ws.cell(index + 2, 2).string(firstSnapshot[path] || 'No match')
//         ws.cell(index + 2, 3).string(secondSnapshot[path] || 'No match')
//         ws.cell(index + 2, 4).string(isEqual ? "+" : "-")
//     });
//     wb.write(pathToSave)
// };
//
// const getHashFile = (path, algorithm = 'md5') => {
//     return hasha.fromFile(path, {algorithm})
// };
//
// const encryptionJSON = (data) => {
//     return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey, {
//         mode: CryptoJS.mode.ECB,
//         keySize: 256,
//     }).toString();
// };
//
// const decryptionJSON = (data) => {
//     const bytes = CryptoJS.AES.decrypt(data, encryptionKey, {
//         mode: CryptoJS.mode.ECB,
//         keySize: 256,
//     });
//     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };
//
// const filter = (array) => {
//     let temp = {};
//     return array.filter(a => {
//         return a in temp ? 0 : temp[a] = 1;
//     })
// }
//
// const getFiles = (dirPath, callback) => {
//     fs.readdir(dirPath, (err, files) => {
//         if (err) return callback(err);
//         let filePaths = [];
//         async.eachSeries(files, (fileName, eachCallback) => {
//             let filePath = path.join(dirPath, fileName);
//             fs.stat(filePath, (err, stat) => {
//                 if (err) return eachCallback(err);
//
//                 if (stat.isDirectory()) {
//                     getFiles(filePath, (err, subDirFiles) => {
//                         if (err) return eachCallback(err);
//                         filePaths = filePaths.concat(subDirFiles);
//                         eachCallback(null);
//                     });
//
//                 } else {
//                     if (stat.isFile())
//                         filePaths.push(filePath);
//                     eachCallback(null);
//                 }
//             });
//         }, (err) => {
//             callback(err, filePaths);
//         });
//     });
// };
//
// const getAllFiles = (directories, callback) => {
//     let filePaths = [];
//     async.eachSeries(directories, (directory, eachCallback) => {
//         getFiles(directory, (err, files) => {
//             if (err) return eachCallback(err);
//             filePaths = filePaths.concat(files);
//             eachCallback(null);
//         });
//     }, (err) => {
//         callback(err, filePaths);
//     });
// };
//
// const handleOnTickSystemAnalysisJob = () => {
//     const notificationStart = new Notification({
//         title: 'FS Snapshot',
//         body: 'The automatic scanning process has begun'
//     })
//     notificationStart.show();
//     const settings = store.get('settings')
//     const limit = promiseLimit(5);
//     if (!settings.disabledSchedule && (Array.isArray(settings.paths) && settings.paths.length)) {
//         getAllFiles(settings.paths, (err, filePaths) => {
//             const getPromiseHashFile = (filePath) => {
//                 return getHashFile(filePath)
//                     .then(hash => {
//                         let res = {};
//                         res[filePath] = hash;
//                         return res;
//                     })
//                     .catch(_ => {
//                         let res = {};
//                         res[filePath] = null;
//                         return res;
//                     });
//             };
//             const promises = filePaths.map(file => {
//                 return limit(() => getPromiseHashFile(file))
//             });
//             Promise.allSettled(promises)
//                 .then(res => {
//                     let hashs = res.reduce((accum, obj) => {
//                         return Object.assign(accum, obj.value);
//                     }, {});
//                     fs.mkdir(path.resolve(app.getAppPath(), 'snapshots'), {recursive: true}, (error) => {
//                         if (error) console.log("[SystemAnalysisJob]", error)
//                         fs.writeFile(path.resolve(app.getAppPath(), `snapshots/${+new Date}.json`),
//                             encryptionJSON(hashs), 'utf8', (error) => {
//                                 if (error) console.log("[SystemAnalysisJob]", error)
//                                 const notificationEnd = new Notification({
//                                     title: 'FS Snapshot', body: 'The automatic scanning process has ended'
//                                 })
//                                 notificationEnd.show()
//                             }
//                         );
//                     });
//                 });
//         })
//     }
// }

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

const status_pwd = status => {
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

module.exports = {
  isDirSync,
  encode_base64,
  decode_base64,
  status_pwd
  // getHashFile,
  // getAllFiles,
  // getFiles,
  // saveAnalysis,
  // handleOnTickSystemAnalysisJob,
  // encryptionJSON,
  // decryptionJSON,
  // filter
};
