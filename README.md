# FrazeWise

## Development

### Project setup

Install the required version of Node.js `>=22.5.1`

```shell
nvm install 22.5.1
```

Install dependencies

```shell
npm ci
```

Create a `.env` file in the project root folder according to the example in `.env.example`.

Spin up the local MongoDb database using Docker

```shell
npm run start:db
```

Start the backend server to access the API locally on port `5200`

```shell
npm run start:api
```

Start the frontend dev server to access the UI on port `4200`

```shell
npm run start:ui:dev
```

Further documentation:

- [API ReadMe](./api/README.md)
- [UI ReadMe](./ui/README.md)

Happy Coding! 🚀

### Code quality checks

Run all quality checks in a row

```shell
npm run checks
```

#### Eslint

```shell
# Lint all codebases
npm run lint

# Lint only the API code
npm run lint:api

# Lint only the UI code
npm run lint:ui
```

#### Prettier

```shell
# Check formatting for all files
npm run format:check

# Format all files
npm run format
```

⚠️ Make sure your IDE is configured to use Eslint and Prettier.

There is a Husky check running before each commit and it will prevent committing with linter or formatter issues in the code.

#### Build checks

```shell
# Build the API (dry run to check compilation)
npm run build:check:api

# Build the UI
npm run build:ui
```
