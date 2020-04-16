const { resolve } = require('path');
const fs = require('fs-extra');

const dir = resolve(__dirname, 'src', 'config');

// Create config files
fs.copy(dir + '/secret.sample.ts', dir + '/secret.ts', { overwrite: false }, (err) => {
  if (err) return console.error(err);
  console.log('\x1b[34m', '- config file `./src/config/secret.ts` created if not exist.\r\n', '\x1b[0m');
  console.log('Now you can start app like this:');
  console.log('\x1b[32m', 'yarn start\r\n', '\x1b[0m');
});
