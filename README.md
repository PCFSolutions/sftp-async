# SFTP-Async

This package contains asynchronous helper methods to make using SFTP with the SSH2 package
easier.

## Usage

To initialize an sftp connection, simply include the package and then call `connect` with
your server settings. Once connected, you can run the other methods (shown below).

### Basic arguments config

```js
  const sftpa = require('sftp-async');

  await sftpa.connect('2.2.2.2', 22, 'username', 'password');

  const dirlist = await sftpa.readdir('/upload');
  const [file] = dirlist;
  const content = await sftpa.getFileData(`/upload/${file.filename}`);

  await sftpa.move(`/upload/${file.filename}`, `/processed/${file.filename}`);
  await sftpa.disconnect();
```

### SSH2 connection config object

https://github.com/mscdex/ssh2#client-methods

```js
  const sftpa = require('sftp-async');

  const config = {
	host: '2.2.2.2',
	port: 22,
	username: 'username',
	password: 'password'
  };

  await sftpa.connect(config);

  const dirlist = await sftpa.readdir('/upload');
  const [file] = dirlist;
  const content = await sftpa.getFileData(`/upload/${file.filename}`);

  await sftpa.move(`/upload/${file.filename}`, `/processed/${file.filename}`);
  await sftpa.disconnect();
```

## Tests

There's a very basic test suite included. Rename `test.config.example.js` to `test.config.js`
and change the settings to match your SFTP server. Drop a file in the source directory and
then run the tests.