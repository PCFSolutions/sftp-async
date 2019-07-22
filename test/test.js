/* eslint-disable no-console */
const sftp = require('../index');
const config = require('./test.config');

const start = async () => {
  try {
    console.log('Connecting...');
    await sftp.connect(config.host, config.port, config.username, config.password);

    console.log('Listing directory...');
    const list = await sftp.readdir(config.sourcedir);
    console.log(JSON.stringify(list, null, 2));

    console.log('Getting file data');
    const data = await sftp.getFileData(`${config.sourcedir}${list[0].filename}`);
    console.log(data);

    console.log('Moving file');
    await sftp.move(
      `${config.sourcedir}${list[0].filename}`,
      `${config.destdir}${list[0].filename}`,
    );
    console.log('Moving it back');
    console.log('Moving file');
    await sftp.move(
      `${config.destdir}${list[0].filename}`,
      `${config.sourcedir}${list[0].filename}`,
    );
    console.log('Move OK');

    console.log('Uploading file data');
    await sftp.upload(`/upload/test.txt`, 'Hello world!');
    console.log('Upload OK');

    console.log('Uploading file using streams');
    await sftp.streamToFtp(`/upload/test2.txt`, 'Hello world!');
    console.log('Upload OK');
  } catch (err) {
    console.log(`Error!: ${err.message}`);
    console.log(JSON.stringify(err, null, 2));
  }
  await sftp.disconnect();
};

const disconnectTimeout = async () => {
  try {
    console.log('Testing repeated connect / disconnect...');
    for (const x of Array(100).keys()) {
      process.stdout.write('.');
      await sftp.connect(config.host, config.port, config.username, config.password);
      await sftp.disconnect();
    }
    console.log('');
    console.log('Completed OK');
  } catch (err) {
    console.log(err);
  }
};

start();
disconnectTimeout();
