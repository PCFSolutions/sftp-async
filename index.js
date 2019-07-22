/* eslint-disable no-underscore-dangle */
const { Writable } = require('stream');
const sftp = require('./lib/sftp');

const o = {};

const connect = async (host, port, username, password /* serverHostKey, kex */) => {
  const connSettings = {
    host,
    port,
    username,
    password,
  };

  try {
    if (o.connection) return o.connection;

    o.connection = await sftp.connect(connSettings);
    return o.connection;
  } catch (err) {
    throw new Error(err.message);
  }
};

const readdir = async path => {
  const list = await sftp.readdir(o.connection, path);
  return list;
};

const disconnect = async () => {
  if (o.connection) {
    await sftp.disconnect(o.connection);
    delete o.connection;
  }
};

const download = function(fileName, writeStream) {
  return new Promise((resolve, reject) => {
    const stream = o.connection.createReadStream(fileName);
    stream.pipe(writeStream);
    stream.on('end', () => {
      resolve(true);
    });
    stream.on('err', () => {
      reject();
    });
  });
};

const getFileData = async fileName => {
  try {
    let data = '';
    const s = new Writable();
    s._write = (chunk, enc, next) => {
      data += chunk.toString();
      next();
    };

    const success = await download(fileName, s);

    if (!success) throw new Error('Failed to get file data');

    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * Create a file on the FTP with the given data. Uses streams.
 *
 * @param {*} fullPath The path and filename of the file to create
 * @param {*} data The data the file will contain
 */
const streamToFtp = async (fullPath, data) => {
  try {
    await sftp.putFileData(o.connection, fullPath, data);
  } catch (err) {
    throw err;
  }
};

/**
 * Create a file on the FTP with the given data.
 *
 * @param {*} filePath The path and filename of the file to create
 * @param {*} content The data the file will contain
 */
const upload = async (filePath, content) => {
  try {
    await sftp.writeFile(o.connection, filePath, content);
  } catch (err) {
    throw err;
  }
};

const move = async (fileFrom, fileTo) => {
  try {
    await sftp.mv(o.connection, fileFrom, fileTo);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  connect,
  readdir,
  disconnect,
  getFileData,
  streamToFtp,
  upload,
  move,
};
