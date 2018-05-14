const hasher = require('hash-dir-contents');
const fs = require('fs');

hasher({
  directory: './src',
  algorithm: 'md5'
}, (error, hash) => {
  fs.readFile('./src/sw.js', 'utf8', (err, data) => {

    const parts = data.split('\n');

    parts[0] = `const HASH = '${hash}';`;

    fs.writeFile('./dist/sw.js', parts.join('\n'), (err, data) => {
      console.log('ServiceWorker moved with custom HASH!');
    });
  });

});
