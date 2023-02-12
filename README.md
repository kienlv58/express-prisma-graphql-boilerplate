# Express-Typescript-Jest-Boilerplate

Skeleton for Express.js applications written in TypeScript with testing support
and CI/CD out of the box.

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
- [x] `cors`
- [x] `mongoose`
- [x] `morgan`

<br>

## Set Application

- Install using `npx @adomne/express-ts-jest-boilerplate my-own-starter-project`

**OR**

- Clone the Application `git clone https://github.com/adomne/express-ts-jest-boilerplate.git`
- Install the dependencies `npm install`

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
| **dist/**                         | Compiled source files will be placed here            |
| **src/**                          | Source files                                         |
| **src/controllers**               | Business logic for routes                            |
| **src/db**                        | DB connectors                                        |
| **src/middleware/**               | Middlewares like Async Handler feature               |
| **src/models**                    | Model definitions                                    |
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

<hr/>

#### *Follow us on* [Twitter](http://www.twitter.com/adomneHQ), [Instagram](http://www.instagram.com/adomnehq), [Linkedin](https://www.linkedin.com/company/adomnehq), and [Github](http://www.github.com/adomne).

