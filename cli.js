#!/usr/bin/env node
'use strict';

const meow = require('meow');
const chromium = require('chromium');
const {execFile} = require('child_process');
//const decamelizeKeys = require('decamelize-keys');

const cli = meow(`
  Usage
  $ chromium [input] [options]
  Input
  url            target url [default: about:blank]
  Options
  --port         same as remote-debugging-port [default: 9222]
  Chromium options will be by-passed
  --print-to-pdf
  --screenshot
  --window-size
  Examples
  $ chromium https://google.com
  $ chromium https://google.com --port=9000
  $ chromium https://google.com --screenshot --window-size=1280,1696
`);

if (cli.input.length <= 0) {
  cli.input.push('about:blank');
}

cli.flags.remoteDebuggingPort = cli.flags.port || 9222;

//const flags = decamelizeKeys(cli.flags, '-');
//const additionalFlags = Object.keys(flags).map(f => {
//  return `--${f}${typeof flags[f] !== 'boolean' ? '=' + flags[f] : ''}`;
//});

// const launcher = new ChromeLauncher({
//   startingUrl: cli.input[0],
//   port: cli.flags.remoteDebuggingPort,
//   autoSelectChrome: true,
// //  additionalFlags: additionalFlags.concat([
// //  '--disable-gpu',
// //  '--headless'
// //  ])
// });

let chromiumProc = null
// run headless chrome browser
new Promise((resolve, reject) => {
  const debugURL = `http://localhost:${cli.flags.remoteDebuggingPort}`;
  chromiumProc = execFile(chromium.path, [debugURL, '--headless'], error => {
    if (error) {
      reject(error)
    } else {
      resolve(debugURL)
    }
  })
}).then((url) => {
  console.log(`Chromium has been started in headless mode. Open ${url} for debugging`);
  console.log(`PID: ${chromiumProc.pid}`);
});

// manage terminating of headless chromium
const exitHandler = err => {
  if (chromeProc) {
    chromiumProc.kill().then(() => {
      process.exit(-1);
    });
  }
}

process.on('SIGINT', exitHandler.bind(null));
process.on('unhandledRejection', exitHandler.bind(null));
process.on('rejectionHandled', exitHandler.bind(null));
process.on('uncaughtException', exitHandler.bind(null));

