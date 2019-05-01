/**
 * A set of helper methods for the SSH2 package.
 * Allows us to use the SFTP methods asynchronously.
 */
const { Client } = require("ssh2");

const conn = new Client();

const connect = settings =>
  new Promise((resolve, reject) => {
    conn
      .on("error", err => {
        reject(err);
      })
      .on("ready", () => {
        conn.sftp((sftpErr, sftp) => {
          if (sftpErr) reject(sftpErr);
          resolve(sftp);
        });
      })
      .connect(settings);
  });

const readdir = (sftp, dirPath) =>
  new Promise((resolve, reject) => {
    sftp.readdir(dirPath, (err, list) => {
      if (err) reject(err);
      resolve(list);
    });
  });

const disconnect = () =>
  new Promise(resolve => {
    resolve(conn.end());
  });

const mv = (sftp, f, t) =>
  new Promise((resolve, reject) => {
    sftp.rename(f, t, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

module.exports = {
  connect,
  disconnect,
  readdir,
  mv
};
