const { writeFile, readFileSync } = require('fs');
const { resolve } = require('path');
require('dotenv').config({ path: '.env' });

const environments = ['DEV', 'PROD'];

const variables = ['PK_API_URL'];

const paths = {
  DEV: './ui/src/environments/environment.development.ts',
  PROD: './ui/src/environments/environment.ts',
};

const packageJson = readFileSync(resolve(__dirname, '..', 'package.json'));
const version = JSON.parse(packageJson).uiVersion;

console.log('[setenv] Current UI version:', version);

environments.forEach(env => {
  const isProd = env === 'PROD';
  let variableList = '';
  variables.forEach(key => {
    variableList += `  ${key}: '${process.env[key + '_' + env]}',\n`;
  });
  const content = `
export const environment = {
  production: ${isProd},
  version: '${version}',
${variableList}
}
  `;
  writeFile(paths[env], content, err => {
    if (err) {
      console.log(`[setenv] Error while setting frontend ${env} environment variables:`, err);
      return;
    }
    console.log(`[setenv] Wrote ${env} environment variables to ${paths[env]}`);
  });
});
