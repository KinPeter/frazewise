import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const packageJsonPath = './package.json';

// Get the current and previous state of package.json
const currentPackageJson = readFileSync(packageJsonPath, 'utf8');
const previousPackageJson = execSync('git show HEAD:package.json').toString();

// Parse the JSON data
const currentDependencies = JSON.parse(currentPackageJson).dependencies || {};
const currentDevDependencies = JSON.parse(currentPackageJson).devDependencies || {};
const previousDependencies = JSON.parse(previousPackageJson).dependencies || {};
const previousDevDependencies = JSON.parse(previousPackageJson).devDependencies || {};

// Check for changes
const dependenciesChanged =
  JSON.stringify(currentDependencies) !== JSON.stringify(previousDependencies);
const devDependenciesChanged =
  JSON.stringify(currentDevDependencies) !== JSON.stringify(previousDevDependencies);

if (dependenciesChanged || devDependenciesChanged) {
  console.warn('--------------------------------------------------------------');
  console.warn('⚠️ Warning: Dependencies have changed in package.json!');
  console.warn('Make sure the dependencies are up to date in api.package.json!');
  console.warn('--------------------------------------------------------------');
} else {
  console.info('✅  Dependencies checked, nothing changed.');
}
