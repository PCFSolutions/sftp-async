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
    await sftp.move(`${config.sourcedir}${list[0].filename}`, `${config.destdir}${list[0].filename}`);
    console.log('Move OK');

    await sftp.disconnect();
  } catch (err) {
    console.log(`Error!: ${err.message}`);
  }
}

start();