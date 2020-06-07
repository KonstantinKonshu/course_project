const fs = require("fs");
// const crypto = require("crypto");

export function isDirSync(aPath) {
  try {
    return fs.statSync(aPath).isDirectory();
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    } else {
      throw e;
    }
  }
}

// Includes crypto module
const crypto = require("crypto");

// Defining key
const key = crypto.randomBytes(32);

// Defining iv
const iv = crypto.randomBytes(16);

// An encrypt function
export function encrypt(text) {
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

export function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  // Creating Decipher
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating encrypted text
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // returns data after decryption
  return decrypted.toString();
}

// Displays output
// var output = encrypt("GeeksforGeeks");
// console.log(output);

// const crypto = require("crypto");
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);
//
// export function encrypt(text) {
//   let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
// }
//
// export function decrypt(text) {
//   let iv = Buffer.from(text.iv, "hex");
//   let encryptedText = Buffer.from(text.encryptedData, "hex");
//   let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);
//   return decrypted.toString();
// }

// export const EncryptionHelper = (function() {
//   function getKeyAndIV(key, callback) {
//     crypto.pseudoRandomBytes(16, function(err, ivBuffer) {
//       const keyBuffer = key instanceof Buffer ? key : new Buffer(key);
//
//       callback({
//         iv: ivBuffer,
//         key: keyBuffer
//       });
//     });
//   }
//
//   function encryptText(cipher_alg, key, iv, text, encoding) {
//     const cipher = crypto.createCipheriv(cipher_alg, key, iv);
//
//     encoding = encoding || "binary";
//
//     let result = cipher.update(text, "utf8", encoding);
//     result += cipher.final(encoding);
//
//     return result;
//   }
//
//   function decryptText(cipher_alg, key, iv, text, encoding) {
//     const decipher = crypto.createDecipheriv(cipher_alg, key, iv);
//
//     encoding = encoding || "binary";
//
//     let result = decipher.update(text, encoding);
//     result += decipher.final();
//
//     return result;
//   }
//
//   return {
//     CIPHERS: {
//       AES_128: "aes128", //requires 16 byte key
//       AES_128_CBC: "aes-128-cbc", //requires 16 byte key
//       AES_192: "aes192", //requires 24 byte key
//       AES_256: "aes256" //requires 32 byte key
//     },
//     getKeyAndIV: getKeyAndIV,
//     encryptText: encryptText,
//     decryptText: decryptText
//   };
// })();
