const globby = require('globby');
const path = require('path');
const fs = require('fs');

const cwd = path.join(__dirname, '..');
const prefix = 'https://raw.githubusercontent.com/zenghongtu/live2d-model-assets/master';

const main = async () => {
  const rootPath = path.join(cwd, 'assets');

  const result = await globby(['**/*model.json', '**.model3.json'], { cwd: rootPath });
  const urls = result.map((f) => encodeURI(`${prefix}/assets/${f}`));
  const indexFilePath = path.join(rootPath, 'model.index');
  fs.writeFileSync(indexFilePath, urls.join('\n'), { encoding: 'utf8' });

  const dirNames = fs
    .readdirSync(rootPath, { withFileTypes: true })
    .map((item) => (item.isDirectory() ? item.name : null))
    .filter(Boolean);

  for (const dirName of dirNames) {
    const dir = path.join(rootPath, dirName);
    const result = await globby(['**/*model.json', '**.model3.json'], { cwd: dir });
    const urls = result.map((f) => encodeURI(`${prefix}/assets/${dirName}/${f}`));
    const indexFilePath = path.join(dir, 'model.index');
    fs.writeFileSync(indexFilePath, urls.join('\n'), { encoding: 'utf8' });
  }
};

main();
