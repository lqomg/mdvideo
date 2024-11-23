const path = require('path');
const fs = require('fs-extra');
const packageJson = require("./package.json");
const publishExe = () => {
  const exe = packageJson.name + '-' + packageJson.version + '-setup.exe';
  const yml = 'latest.yml';
  const latestExe = packageJson.name + '-' + 'lasted-setup.exe';
  fs.removeSync('./dist/publish');
  fs.copySync('./dist/' + exe, './dist/publish/' + exe);
  fs.copySync('./dist/' + yml, './dist/publish/' + yml);
  fs.copySync('./dist/' + exe, './dist/publish/' + latestExe);
}
publishExe();