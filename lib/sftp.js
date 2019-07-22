/**
 * A set of helper methods for the SSH2 package.
 * Allows us to use the SFTP methods asynchronously.
 */
const { Client } = require('ssh2');
const { Readable } = require('stream');

const connect = settings =>
  new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on('error', err => {
        reject(err);
      })
      .on('ready', () => {
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

const disconnect = (sftp) =>
  new Promise(resolve => {
    resolve(sftp.end());
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

const writeFile = (sftp, f, c) =>
  new Promise((resolve, reject) => {
    sftp.writeFile(f, c, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const putFileData = (sftp, fullPath, data) =>
  new Promise((resolve, reject) => {
    const readStream = new Readable();
    const writeStream = sftp.createWriteStream(fullPath);

    // what to do when transfer finishes
    writeStream.on('close', () => resolve(true)).on('error', err => reject(err));

    // initiate transfer of file
    readStream.pipe(writeStream);
    readStream.push(data);
    readStream.push(null);
  });

module.exports = {
  connect,
  disconnect,
  readdir,
  mv,
  putFileData,
  writeFile,
};
