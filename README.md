# RESTful API Node Server Boilerplate

A boilerplate/starter project for quickly building RESTful APIs using Node.js, Express, TypeScript, and Sequelize (Relational Database).

By running a single command, you will get a production-ready Node.js Typescript fully configured. The app comes with many built-in features, such as authentication using JWT, request validation, unit tests, docker support, API documentation, etc. For more details, check the features list below.

## Quick Start

To create a project:

```bash
git clone --depth 1 https://github.com/noelzapy/ts-node-express-boilerplate.git <project-name>
cd <project-name>
npx rimraf ./.git
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env.test.local

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Logging](#logging)
- [Linting](#linting)
- [Contributing](#contributing)

## Features

- **MySQL database**: [Sequelize](https://sequelize.org/) ORM with [MySQL](https://www.mysql.com/) database. You can easily switch to [PostgreSQL](https://www.postgresql.org/) or [SQLite](https://www.sqlite.org/index.html) by changing the configuration.
- **Typescript**: using [TypeScript](https://www.typescriptlang.org/)
- **Express**: using [Express](https://expressjs.com/)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Class Validator](https://github.com/typestack/class-validator)
- **Logging**: using [winston](https://github.com/winstonjs/winston)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**: with [Docker](https://www.docker.com)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start

# or using PM2

yarn deploy:prod
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env.<env>.<tld>` file. They come with these default values:

```bash

# PORT
PORT = 3000

# DATABASE
DB_USER = root
DB_PASSWORD = password
DB_HOST = localhost
DB_PORT = 3306
DB_DATABASE = db_name

# TOKEN
SECRET_KEY = secretKey
TOKEN_EXPIRES_IN = 289 # days

# MAIL
MAIL_HOST = smtp.ethereal.email
MAIL_PORT = 587
MAIL_USER = richard.mueller@ethereal.email
MAIL_PASSWORD = tvPsDNJvm7DDZ3eEMR
MAIL_FROM = Richard Mueller

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--database\       # Database connection and migrations and seeds
 |--dtos\           # Data transfer objects (class validator schemas)
 |--exceptions\     # Custom application exceptions
 |--http\           # Http related things
 |--interfaces\     # Typescript interfaces
 |--logs\           # Log files
 |--middlewares\    # Custom express middlewares
 |--models\         # Data models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--test\           # Tests (unit)
 |--utils\          # Utility classes and functions
 |--app.ts          # Express app
 |--server.ts        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api-docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the `.swagger.yaml` file.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /signup` - register\
`POST /login` - login\

**User routes**:\
`POST /users` - create a user\
`GET /users` - get all users\
`GET /users/:userId` - get user\
`PUT /users/:userId` - update user\
`DELETE /users/:userId` - delete user

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```typescript
import catchAsync from '@/utils/catchAsync';

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility `httpException` class to which you can attach a response code and a message, and then throw it from anywhere (`catchAsync` will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
  import httpStatus from 'http-status';
  import catchAsync from '@/utils/catchAsync';
  import httpException from '@/exceptions/httpException';
  import DB from '@/database';

const getUser = async (userId) => {
  const user = await DB.User.findByPk(userId);
  if (!user) {
    throw new httpException(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

## Validation

Request data is validated using [Class Validator](https://github.com/typestack/class-validator). Check the [documentation](https://github.com/typestack/class-validator) for more details on how to write validation schemas or classes.

The validation classes are defined in the `src/dtos` directory and are used in the routes by providing them as parameters to the `ValidationMiddleware` middleware.

```typescript
import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(CreateUserDto, 'body'), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(LoginUserDto, 'body'), this.auth.logIn);
  }
}
```

## Authentication

To require authentication for certain routes, you can use the `AuthMiddleware` middleware.

```typescript
import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    // HERE
    this.router.get(`${this.path}`, AuthMiddleware(), this.user.getUsers);
  }
}
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /register`) or login (`POST /login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 2 days. You can modify this expiration time by changing the `TOKEN_EXPIRES_IN` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for `X + 10` days, where is `TOKEN_EXPIRES_IN` in the .env file.

## Authorization

The `AuthMiddleware` middleware can also be used to require certain rights/permissions to access a route.

```typescript
import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {


    this.router.get(`${this.path}`, AuthMiddleware("manageUsers"), this.user.getUsers);
  }
}


```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/constants.ts` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `@utils/logger`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```typescript
import { logger } from '@utils/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

All log messages are stored in the `src/logs` directory.\


## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc` file. To modify the Prettier configuration, update the `.prettierrc` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Inspirations
- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [madhums/node-express-mongoose](https://github.com/madhums/node-express-mongoose)
- [kunalkapadia/express-mongoose-es6-rest-api](https://github.com/kunalkapadia/express-mongoose-es6-rest-api)

## License

[MIT](LICENSE)
