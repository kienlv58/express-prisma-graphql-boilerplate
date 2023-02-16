# Express-Prisma-Graphql-Boilerplate

Skeleton for Express.js applications written in TypeScript with testing support
and CI/CD out of the box.
Fork from repo: https://github.com/adomne/express-ts-jest-boilerplate.git
<br>

## Purpose

The main purpose of this Skeleton is to start an Express Application
with typescript, testing support and default CI/CD configuration.

<br>

## Common Features

- Integrated eslint, prettier, jest, and husky.
- CI/CD Configuration by default.
- Simple and Standard scaffolding.
- Based on Typescript Syntax.
- Integrated morgan logger.
- Test cases Support.

<br>

## Core NPM Modules

- [x] `express`
- [x] `express-actuator`
- [x] `helmet`
- [x] `dotenv`
- [x] `node-config`
- [x] `cors`
- [x] `morgan`
- [x] `prisma`
- [x] `graphql`
- [x] `type-graphql`

<br>

<br>

## Setup and Run
Install dotenv-cli to use multiple .env file (.env.test, .env.development, .env.production)
```
yarn global add dotenv-cli
```

Create the .env.development file and add the following params:
```
PORT = 3000
BASE_URL = github.com
NODE_ENV = development
DB_HOST = localhost
DB_NAME = db_test
DB_PASSWORD = root
DB_PORT = 3306
DB_USER = root
DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```
After install node_modules. Run script to migrate database

```
yarn migrate
```

Maybe need to seed the database
```
yarn seed
```

Generate the type-graphql from prisma
```
yarn generate-type
```

Start the dev server
```
yarn dev
```

And go to the url: http://localhost:3000/graphql to see the result.
<br>

## Project Structure

| Name                              | Description                                          |
| --------------------------------- | ---------------------------------------------------  |
| **.husky/**                       | Git hooks configuration                              |
| **.github/**                      | Github actions configuration                         |
| **.vscode/**                      | Launch options for jest (using Jest ext from `orta`) |
| **api/**                          | Endpoint testing (using thunder client ext)          |
| **config/**                       | Environment files                                    |
| **CI/**                           | CI/CD configuration steps                            |
| **prisma/**                       | Include prisma schema, type-graphql generated        |
| **dist/**                         | Compiled source files will be placed here            |
| **src/**                          | Source files                                         |
| **src/controllers**               | Business logic for routes                            |
| **src/db**                        | DB connectors                                        |
| **src/middleware/**               | Middlewares like Async Handler feature               |
| **src/models**                    | Model definitions                                    |
| **src/resolvers/**                | Create custom resolvers for type-graphql             |
| **src/routers**                   | Route definitions                                    |
| **src/services**                  | 3rd party services                                   |
| **tests/**                        | Test cases will be placed here                       |

<br>

## Default System Health Status API

- `${host}/info` - Displays application information
- `${host}/metrics` - Shows metrics information for the current application.
- `${host}/health` - Shows application health information.

<br>

## Notes

#### 1. Husky Configuration files (pre-commit and pre-push)

- Check CONFIGURATION.md inside `.husky` folder.

#### 2. [Check Express Best Practices to Secure Your App](https://expressjs.com/en/advanced/best-practice-security.html)

<br>
<br>

