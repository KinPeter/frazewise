# FrazeWise UI

## Deployment

The UI deploys via FTP using a GitHub action. The action is triggered by pushing a specific tag: `ui-v*.*.*`.
The workflow will build the UI and deploy it to the FTP server.
It is defined in `.github/workflows/ui-deploy.yml`.

Follow these steps to deploy the UI:

1. Increase the UI version in the `package.json` file: `"uiVersion": "x.x.x"`.
2. Commit the changes and push them to the `main` branch.
3. Create a new tag with the format `ui-v*.*.*` (e.g. `ui-v1.0.0`) and push the tag too.
   ```shell
   git tag ui-v1.0.0
   git push origin --tags
   ```
4. The GitHub action will be triggered and deploy the UI to the FTP server.
