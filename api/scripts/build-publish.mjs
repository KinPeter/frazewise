import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(readFileSync('./api.package.json', 'utf-8'));
const versionParts = packageJson.version.split('.');
versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();
const newVersion = versionParts.join('.');
packageJson.version = newVersion;
writeFileSync('./api.package.json', JSON.stringify(packageJson, null, 2));
execSync('npx prettier --write ./api.package.json', { stdio: 'inherit' });
console.log(`Version bumped to ${newVersion}`);

execSync(
  `docker build -f ./api/docker/api.Dockerfile -t kinp/frazewise:${newVersion} -t kinp/frazewise:latest .`,
  {
    stdio: 'inherit',
  }
);

execSync(`docker push kinp/frazewise:${newVersion}`, { stdio: 'inherit' });
execSync(`docker push kinp/frazewise:latest`, { stdio: 'inherit' });

console.log(`Docker image tagged with version ${newVersion} and latest has been pushed.`);
